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
  const flats = db.collection("flats");

  const user = await users.findOne({ email: session.user.email });

  if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
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
    status: "pending",
  };

  await users.updateOne(
    { email: session.user.email },
    { $push: { applications: application } }
  );

  await flats.updateOne(
    { _id: new ObjectId(flatId) },
    { $addToSet: { applicants: user._id } } 
  );

  return new Response(JSON.stringify({ message: "Application submitted" }), { status: 200 });
}
