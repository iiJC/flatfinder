import { NextResponse } from "next/server";
import clientPromise from "@/db/database";
import { ObjectId } from "mongodb";

export async function PUT(req) {
  try {
    const { id, ...flatData } = await req.json();

    const client = await clientPromise;
    const db = client.db("flatfinderdb");

    await db.collection("flats").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...flatData,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating flat:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
