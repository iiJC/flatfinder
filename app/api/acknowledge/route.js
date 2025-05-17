import { ObjectId } from "mongodb";
import clientPromise from "@/db/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { applicationId } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db("flatfinderdb");
    
    // Verify user's flat ownership
    const user = await db.collection("users").findOne({ email: session.user.email });
    if (!user?.listing) return new Response("No flat listed", { status: 403 });

    // Verify application belongs to user's flat
    const application = await db.collection("applications").findOne({
      _id: new ObjectId(applicationId),
      flatId: user.listing
    });
    if (!application) return new Response("Not found", { status: 404 });

    // Update status
    await db.collection("applications").updateOne(
      { _id: new ObjectId(applicationId) },
      { $set: { status: "acknowledged" } }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response("Server error", { status: 500 });
  }
}