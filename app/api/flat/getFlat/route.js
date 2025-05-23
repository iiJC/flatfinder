import { NextResponse } from "next/server";
import clientPromise from "@/db/database";
import { ObjectId } from "mongodb";

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ flat: null }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("flatfinderdb");

    // find user by email
    const user = await db.collection("users").findOne({ email });

    // if user has no listing, return null
    if (!user?.listing) {
      return NextResponse.json({ flat: null });
    }

    // fetch flat by id
    const flat = await db
      .collection("flats")
      .findOne({ _id: new ObjectId(user.listing) });

    return NextResponse.json({ flat: flat || null });
  } catch (err) {
    console.error("Error fetching user flat:", err);
    return NextResponse.json({ flat: null }, { status: 500 });
  }
}
