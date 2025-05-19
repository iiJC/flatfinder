import { ObjectId } from "mongodb";
import clientPromise from "../../../db/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { sendEmail } from "../../../lib/email";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { applicationId } = await req.json();

  if (!ObjectId.isValid(applicationId)) {
    return new Response("Invalid application ID", { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("flatfinderdb");

    const users = db.collection("users");
    const applications = db.collection("applications");

    // Get current user
    const user = await users.findOne({ email: session.user.email });
    if (!user || !user.listing) {
      return new Response("You must own a flat to reject applications", {
        status: 403
      });
    }

    // Get the application (make sure it's for this user's flat)
    const application = await applications.findOne({
      _id: new ObjectId(applicationId),
      flatId: user.listing
    });

    if (!application) {
      return new Response("Application not found or unauthorized", {
        status: 404
      });
    }

    // Get the applicant
    const applicant = await users.findOne({
      _id: new ObjectId(application.applicantId)
    });
    if (!applicant) {
      return new Response("Applicant not found", { status: 404 });
    }

    // Delete the application
    const result = await applications.deleteOne({
      _id: new ObjectId(applicationId),
      flatId: user.listing
    });

    if (result.deletedCount === 0) {
      return new Response("Application could not be deleted", { status: 404 });
    }

    // Send rejection email
    const emailResult = await sendEmail({
      to: applicant.email,
      subject: "Application Update – Rejected",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #a94442;">Application Rejected</h2>
          <p>Hello ${applicant.name || applicant.username},</p>
          <p>We regret to inform you that your application for the property at <strong>${
            application.address
          }</strong> has not been successful.</p>
          <p>Thank you for your interest in FlatFinder. We wish you all the best in your flat search.</p>
          <p style="margin-top: 30px;">Best regards,<br>The FlatFinder Team</p>
        </div>
      `
    });

    if (!emailResult.success) {
      console.error("❌ Failed to send rejection email:", emailResult.error);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("❌ Error in /api/reject:", error);
    return new Response("Server error", { status: 500 });
  }
}
