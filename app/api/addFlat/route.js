import clientPromise from "../../../db/database";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const flat = await req.json();

    // Strip out any manually assigned _id (Mongo will auto-generate one)
    if ("_id" in flat) {
      delete flat._id;
    }

    const client = await clientPromise;
    const db = client.db("flatfinderdb");
    const collection = db.collection("flats");

    const result = await collection.insertOne(flat);

    return NextResponse.json(
      {
        success: true,
        message: "Flat added!",
        insertedId: result.insertedId
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Failed to add flat:", err);
    return NextResponse.json(
      { success: false, message: "Error adding flat." },
      { status: 500 }
    );
  }
}
