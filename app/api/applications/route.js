import clientPromise from "../../../db/database";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route.js";
import { sendEmail } from "../../../lib/email";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        status: 401
      });
    }

    const body = await req.json();
    const { flatId, address, message, refereeName, refereePhone } = body;

    if (!ObjectId.isValid(flatId)) {
      return new Response(JSON.stringify({ error: "Invalid flat ID" }), {
        status: 400
      });
    }

    const client = await clientPromise;
    const db = client.db("flatfinderdb");
    const mongoSession = client.startSession();

    try {
      let applicationId;
      let flatDetails;
      let ownerDetails;

      await mongoSession.withTransaction(async () => {
        const users = db.collection("users");
        const flats = db.collection("flats");
        const applications = db.collection("applications");

        // Get user and flat details
        const user = await users.findOne(
          { email: session.user.email },
          { session: mongoSession }
        );
        if (!user) {
          throw new Error("User not found");
        }

        const flatObjectId = new ObjectId(flatId);
        flatDetails = await flats.findOne(
          { _id: flatObjectId },
          { session: mongoSession }
        );
        if (!flatDetails) {
          throw new Error("Flat not found");
        }

        ownerDetails = await users.findOne(
          { _id: flatDetails.ownerId },
          { session: mongoSession, projection: { email: 1, name: 1 } }
        );

        // Create application
        const application = {
          flatId: flatObjectId,
          applicantId: user._id,
          name: user.name,
          email: user.email,
          address,
          status: "pending",
          dateApplied: new Date(),
          message,
          refereeName,
          refereePhone
        };

        const result = await applications.insertOne(application, {
          session: mongoSession
        });
        applicationId = result.insertedId;

        await flats.updateOne(
          { _id: flatObjectId },
          { $addToSet: { applicants: user._id } },
          { session: mongoSession }
        );
      });

      // Send emails after successful transaction
      const applicantEmail = session.user.email;
      const ownerEmail = ownerDetails.email;

      // Email to applicant
      await sendEmail({
        to: applicantEmail,
        subject: `Application Submitted for ${flatDetails.address}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6fa5;">Application Submitted Successfully</h2>
            <p>Hello ${session.user.name},</p>
            <p>Your application for the property at <strong>${
              flatDetails.address
            }</strong> has been received.</p>
            <p><strong>Application ID:</strong> ${applicationId}</p>
            <p><strong>Submitted on:</strong> ${new Date().toLocaleDateString()}</p>
            ${message ? `<p><strong>Your message:</strong> ${message}</p>` : ""}
            <p>The property owner will review your application and contact you directly if interested.</p>
            <p style="margin-top: 30px;">Best regards,<br>The FlatFinder Team</p>
          </div>
        `
      });

      // Email to property owner
      await sendEmail({
        to: ownerEmail,
        subject: `New Application for ${flatDetails.address}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6fa5;">New Rental Application</h2>
            <p>Hello ${ownerDetails.name},</p>
            <p>You have received a new application for your property at <strong>${
              flatDetails.address
            }</strong>.</p>
            <h3 style="color: #4a6fa5;">Applicant Details</h3>
            <p><strong>Name:</strong> ${session.user.name}</p>
            <p><strong>Contact Email:</strong> ${session.user.email}</p>
            ${
              address
                ? `<p><strong>Current Address:</strong> ${address}</p>`
                : ""
            }
            ${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}
            <h3 style="color: #4a6fa5;">Reference Details</h3>
            <p><strong>Reference Name:</strong> ${refereeName}</p>
            <p><strong>Reference Phone:</strong> ${refereePhone}</p>
            <p style="margin-top: 20px; font-weight: bold;">
              Please log in to your FlatFinder dashboard to review this application.
            </p>
            <p style="margin-top: 30px;">Best regards,<br>The FlatFinder Team</p>
          </div>
        `
      });

      return new Response(
        JSON.stringify({
          success: true,
          applicationId,
          message: "Application submitted successfully"
        }),
        { status: 200 }
      );
    } finally {
      await mongoSession.endSession();
    }
  } catch (error) {
    console.error("POST /api/applications error:", error);
    const status = error.message.includes("not found") ? 404 : 500;
    return new Response(
      JSON.stringify({
        error: error.message || "Internal Server Error",
        details: status === 500 ? error.stack : undefined
      }),
      { status }
    );
  }
}
