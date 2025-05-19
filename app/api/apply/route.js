import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import clientPromise from "../../../db/database.js";
import { ObjectId } from "mongodb";
import { sendEmail } from "../../../lib/email";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401
    });
  }

  const body = await req.json();
  const {
    flatId,
    fullName,
    email,
    phone,
    location,
    budget,
    rooms,
    about,
    type
  } = body;

  try {
    const client = await clientPromise;
    const db = client.db("flatfinderdb");
    const users = db.collection("users");
    const flats = db.collection("flats");

    const user = await users.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404
      });
    }

    // Get flat details including owner information
    const flat = await flats.findOne({ _id: new ObjectId(flatId) });
    if (!flat) {
      return new Response(JSON.stringify({ message: "Flat not found" }), {
        status: 404
      });
    }

    const flatOwner = await users.findOne({ _id: flat.ownerId });
    if (!flatOwner) {
      return new Response(JSON.stringify({ message: "Flat owner not found" }), {
        status: 404
      });
    }

    const application = {
      flatId: new ObjectId(flatId),
      fullName,
      email,
      phone,
      location,
      budget,
      rooms,
      about,
      type,
      dateApplied: new Date(),
      status: "pending"
    };

    // Update user and flat in a transaction for data consistency
    const session = client.startSession();
    try {
      await session.withTransaction(async () => {
        await users.updateOne(
          { email: session.user.email },
          { $push: { applications: application } },
          { session }
        );

        await flats.updateOne(
          { _id: new ObjectId(flatId) },
          { $addToSet: { applicants: user._id } },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    // Send email to applicant
    const applicantEmailResult = await sendEmail({
      to: email,
      subject: "Your FlatFinder Application Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6fa5;">Application Submitted Successfully!</h2>
          <p>Hello ${fullName},</p>
          <p>We've received your application for the flat at <strong>${flat.address}</strong>.</p>
          <p>Here are your application details:</p>
          <ul>
            <li><strong>Budget:</strong> ${budget}</li>
            <li><strong>Preferred Rooms:</strong> ${rooms}</li>
            <li><strong>Location Preference:</strong> ${location}</li>
          </ul>
          <p>The flat owner will review your application and contact you if interested.</p>
          <p style="margin-top: 30px;">Good luck with your flat search!</p>
          <p>Best regards,<br>The FlatFinder Team</p>
        </div>
      `
    });

    // Send notification email to flat owner
    const ownerEmailResult = await sendEmail({
      to: flatOwner.email,
      subject: `New Application for Your Flat at ${flat.address}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6fa5;">New Flat Application</h2>
          <p>Hello ${flatOwner.name},</p>
          <p>You've received a new application for your flat at <strong>${flat.address}</strong>.</p>
          <p>Applicant details:</p>
          <ul>
            <li><strong>Name:</strong> ${fullName}</li>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Budget:</strong> ${budget}</li>
            <li><strong>Preferred Rooms:</strong> ${rooms}</li>
            <li><strong>About:</strong> ${about}</li>
          </ul>
          <p>Please log in to your FlatFinder account to review and respond to this application.</p>
          <p style="margin-top: 30px;">Best regards,<br>The FlatFinder Team</p>
        </div>
      `
    });

    if (!applicantEmailResult.success || !ownerEmailResult.success) {
      console.error("Email sending issues:", {
        applicant: applicantEmailResult.error,
        owner: ownerEmailResult.error
      });
      // Continue despite email issues since the application was successfully submitted
    }

    return new Response(
      JSON.stringify({
        message: "Application submitted successfully",
        applicationId: application._id
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during application submission:", error);
    return new Response(
      JSON.stringify({
        message: "An error occurred while processing your application",
        error: error.message
      }),
      { status: 500 }
    );
  }
}
