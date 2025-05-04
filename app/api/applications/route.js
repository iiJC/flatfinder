import clientPromise from "../../../db/database";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route.js";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const body = await req.json();
    const { flatId, address, message, refereeName, refereePhone } = body;

    if (!ObjectId.isValid(flatId)) {
      return new Response(JSON.stringify({ error: "Invalid flat ID" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("flatfinderdb");

    const users = db.collection("users");
    const flats = db.collection("flats");

    const user = await users.findOne({ email: session.user.email });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const application = {
      flatId: new ObjectId(flatId),
      address,
      status: "pending",
      dateApplied: new Date(),
      message,
      refereeName,
      refereePhone,
    };

    await users.updateOne(
      { _id: user._id },
      { $push: { applications: application } }
    );

    await flats.updateOne(
      { _id: new ObjectId(flatId) },
      { $addToSet: { applicants: user._id } }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error("POST /api/applications error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
