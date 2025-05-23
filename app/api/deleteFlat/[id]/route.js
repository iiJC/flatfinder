import { NextResponse } from "next/server";
import clientPromise from "@/db/database";
import { ObjectId } from "mongodb";

export async function DELETE(_, { params }) {
  const { id } = params;

  // check if id is valid
  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid ID" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("flatfinderdb");
    // delete flat by id
    const result = await db
      .collection("flats")
      .deleteOne({ _id: new ObjectId(id) });
    // check if delete was successful
    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true, message: "Flat deleted" });
    } else {
      return NextResponse.json(
        { success: false, message: "Flat not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
