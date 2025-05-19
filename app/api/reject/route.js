import { ObjectId } from "mongodb";
import clientPromise from "../../../db/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { sendEmail } from "../../../lib/email";

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

    // Get application details before deletion
    const application = await db.collection("applications").findOne({
      _id: new ObjectId(applicationId),
      flatId: user.listing
    });
    if (!application) return new Response("Not found", { status: 404 });

    // Delete the application
    const result = await db.collection("applications").deleteOne({
      _id: new ObjectId(applicationId),
      flatId: user.listing
    });

    if (result.deletedCount === 0)
      return new Response("Not found", { status: 404 });

    // Send rejection email
    await sendEmail({
      to: application.email,
      subject: "Application Update – Rejected",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #a94442;">Application Rejected</h2>
          <p>Hello ${application.name},</p>
          <p>We regret to inform you that your application for the property at <strong>${application.address}</strong> has not been successful.</p>
          <p>Thank you for your interest in FlatFinder. We wish you all the best in your search for accommodation.</p>
          <p style="margin-top: 30px;">Best regards,<br>The FlatFinder Team</p>
        </div>
      `
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/reject:", error);
    return new Response("Server error", { status: 500 });
  }
}
