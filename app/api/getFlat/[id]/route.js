import clientPromise from "@/db/database";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  const { id } = params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid flat ID" }, { status: 400 });
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
    console.error("Error fetching flat:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid flat ID" }, { status: 400 });
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
    console.error("Error fetching flat:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
