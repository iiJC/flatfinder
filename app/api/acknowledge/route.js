import { ObjectId } from "mongodb";
import clientPromise from "@/db/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { sendEmail } from "@/lib/email";

export async function POST(req) {
  // get user session
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  // parse request body
  const { applicationId } = await req.json();

  if (!ObjectId.isValid(applicationId)) {
    return new Response("Invalid application ID", { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("flatfinderdb");

    const users = db.collection("users");
    const applications = db.collection("applications");
    const flats = db.collection("flats");

    // find current user
    const user = await users.findOne({ email: session.user.email });
    if (!user || !user.listing) {
      return new Response("You must own a flat to acknowledge applications", {
        status: 403
      });
    }

    // find application linked to user's flat
    const application = await applications.findOne({
      _id: new ObjectId(applicationId),
      flatId: user.listing
    });

    if (!application) {
      return new Response(
        "Application not found or does not belong to your flat",
        { status: 404 }
      );
    }

    // update application status to acknowledged
    await applications.updateOne(
      { _id: new ObjectId(applicationId) },
      { $set: { status: "acknowledged" } }
    );

    // get applicant info
    const applicant = await users.findOne({
      _id: new ObjectId(application.applicantId)
    });
    if (!applicant) {
      return new Response("Applicant not found", { status: 404 });
    }

    // send email notification to applicant
    const emailResult = await sendEmail({
      to: applicant.email,
      subject: "Your Application Has Been Acknowledged",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6fa5;">Application Acknowledged</h2>
          <p>Hello ${applicant.name || applicant.username},</p>
          <p>Your application for the property at <strong>${
            application.address
          }</strong> has been acknowledged by the owner.</p>
          <p>They may contact you soon if they are interested in moving forward.</p>
          <p style="margin-top: 30px;">Best regards,<br>The FlatFinder Team</p>
        </div>
      `
    });

    if (!emailResult.success) {
      console.error(
        "❌ Failed to send acknowledgement email:",
        emailResult.error
      );
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("❌ Error in /api/acknowledge:", error);
    return new Response("Server error", { status: 500 });
  }
}
