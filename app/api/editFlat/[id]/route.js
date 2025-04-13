import clientPromise from "@/db/database";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("flatfinderdb");
    const flats = db.collection("flats");

    const updateResult = await flats.updateOne(
      { _id: new ObjectId(id) },
      { $set: body }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Flat not found or nothing changed." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Flat updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("EditFlat error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update flat." },
      { status: 500 }
    );
  }
}
