// app/api/getFlat/[id]/route.js

import clientPromise from "@/db/database";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("flatfinderdb");

    const flat = await db
      .collection("flats")
      .findOne({ _id: new ObjectId(id) });

    if (!flat) {
      return NextResponse.json({ error: "Flat not found" }, { status: 404 });
    }

    return NextResponse.json(flat);
  } catch (err) {
    console.error("Failed to fetch flat:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
