import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import clientPromise from "../../../db/database.js";
import { ObjectId } from "mongodb";
import { sendEmail } from "../../../lib/email";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401
    });
  }

  const body = await req.json();
  const { flatId, phone, location, budget, rooms, about, type } = body;

  if (!ObjectId.isValid(flatId)) {
    return new Response(JSON.stringify({ error: "Invalid flat ID" }), {
      status: 400
    });
  }

  const client = await clientPromise;
  const db = client.db("flatfinderdb");
  const mongoSession = client.startSession();

  try {
    let flat, owner, applicant, applicationId;

    // run db ops in transaction
    await mongoSession.withTransaction(async () => {
      const users = db.collection("users");
      const flats = db.collection("flats");
      const applications = db.collection("applications");

      // Get applicant
      applicant = await users.findOne(
        { email: session.user.email },
        { session: mongoSession }
      );
      if (!applicant) throw new Error("User not found");

      // Get flat
      flat = await flats.findOne(
        { _id: new ObjectId(flatId) },
        { session: mongoSession }
      );
      if (!flat) throw new Error("Flat not found");

      // Get flat owner
      if (!flat.ownerId || !ObjectId.isValid(flat.ownerId)) {
        throw new Error("Flat has invalid or missing ownerId");
      }

      owner = await users.findOne(
        { _id: new ObjectId(flat.ownerId) },
        { session: mongoSession, projection: { name: 1, email: 1 } }
      );
      if (!owner) throw new Error("Owner not found");

      // Create application
      const application = {
        flatId: flat._id,
        applicantId: applicant._id,
        address: flat.address,
        phone,
        location,
        budget,
        rooms,
        about,
        type,
        status: "pending",
        dateApplied: new Date()
      };

      const result = await applications.insertOne(application, {
        session: mongoSession
      });
      applicationId = result.insertedId;

      // Track applicant in flat document
      await flats.updateOne(
        { _id: flat._id },
        { $addToSet: { applicants: applicant._id } },
        { session: mongoSession }
      );
    });

    // 📧 Send confirmation to applicant
    const applicantEmailResult = await sendEmail({
      to: applicant.email,
      subject: `Application Submitted for ${flat.address}`,
      html: `
        <p>Hi ${applicant.name || applicant.username},</p>
        <p>Your application for <strong>${
          flat.address
        }</strong> has been received.</p>
        <p>We'll notify the owner and let you know if they respond.</p>
      `
    });

    if (!applicantEmailResult.success) {
      console.error(
        "❌ Email to applicant failed:",
        applicantEmailResult.error
      );
    }

    // 📧 Notify flat owner
    const ownerEmailResult = await sendEmail({
      to: owner.email,
      subject: `New Application for Your Flat at ${flat.address}`,
      html: `
        <p>Hello ${owner.name || "Owner"},</p>
        <p>You have received a new application for your flat at <strong>${
          flat.address
        }</strong>.</p>
        <p><strong>Applicant:</strong> ${
          applicant.name || applicant.username
        }</p>
        <p><strong>Email:</strong> ${applicant.email}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Rooms:</strong> ${rooms}</p>
        <p><strong>Location Preference:</strong> ${location}</p>
        <p><strong>About:</strong> ${about}</p>
      `
    });

    if (!ownerEmailResult.success) {
      console.error("❌ Email to owner failed:", ownerEmailResult.error);
    }

    return new Response(JSON.stringify({ success: true, applicationId }), {
      status: 200
    });
  } catch (error) {
    console.error("❌ Error in /api/apply:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500
    });
  } finally {
    await mongoSession.endSession();
  }
}
