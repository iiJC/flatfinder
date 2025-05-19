import { ObjectId } from "mongodb";
import clientPromise from "@/db/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { sendEmail } from "@/lib/email";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { applicationId } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db("flatfinderdb");

    // Verify user's flat ownership
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });
    if (!user?.listing) return new Response("No flat listed", { status: 403 });

    // Verify application belongs to user's flat
    const application = await db.collection("applications").findOne({
      _id: new ObjectId(applicationId),
      flatId: user.listing
    });
    if (!application) return new Response("Not found", { status: 404 });

    // Get applicant details
    const applicant = await db
      .collection("users")
      .findOne({ _id: application.applicantId });
    if (!applicant) return new Response("Applicant not found", { status: 404 });

    // Update application status
    await db
      .collection("applications")
      .updateOne(
        { _id: new ObjectId(applicationId) },
        { $set: { status: "acknowledged" } }
      );

    // Send email to applicant
    await sendEmail({
      to: applicant.email,
      subject: "Your Application Has Been Acknowledged",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6fa5;">Application Acknowledged</h2>
          <p>Hello ${applicant.name || "applicant"},</p>
          <p>Your application for the property at <strong>${
            application.address
          }</strong> has been acknowledged by the owner.</p>
          <p>The owner may contact you directly with further steps or questions.</p>
          <p style="margin-top: 30px;">Best regards,<br>The FlatFinder Team</p>
        </div>
      `
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/acknowledge:", error);
    return new Response("Server error", { status: 500 });
  }
}
