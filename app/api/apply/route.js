// app/api/apply/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import clientPromise from "../../../db/database.js";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
  }

  const body = await req.json();
  const { flatId, fullName, email, phone, location, budget, rooms, about, type } = body;

  const client = await clientPromise;
  const db = client.db("flatfinderdb");
  const users = db.collection("users");

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
    status: "pending",
  };

  await users.updateOne(
    { email: session.user.email },
    { $push: { applications: application } }
  );

  return new Response(JSON.stringify({ message: "Application submitted" }), { status: 200 });
}
