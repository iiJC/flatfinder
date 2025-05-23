import clientPromise from "@/db/database";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req, context) {
  const { id } = await context.params;
  const body = await req.json();
  delete body._id;

  const client = await clientPromise;
  const db = client.db("flatfinderdb");
  // update flat with new data
  const result = await db
    .collection("flats")
    .updateOne({ _id: new ObjectId(id) }, { $set: body });
  // handle no update
  if (result.modifiedCount === 0) {
    return NextResponse.json({ message: "No update" }, { status: 400 });
  }

  return NextResponse.json({ message: "Success" }, { status: 200 });
}
