import clientPromise from "@/db/database";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(_, { params }) {
  // get flat id from params
  const { id } = await params;

  // validate id
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid flat ID" }, { status: 400 });
  }

  try {
    // connect to db
    const client = await clientPromise;
    const db = client.db("flatfinderdb");

    // find flat by id
    const flat = await db
      .collection("flats")
      .findOne({ _id: new ObjectId(id) });

    if (!flat) {
      return NextResponse.json({ error: "Flat not found" }, { status: 404 });
    }

    return NextResponse.json(flat);
  } catch (err) {
    console.error("error fetching flat:", err);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  // get flat id from params
  const { id } = await params;

  // validate id
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid flat ID" }, { status: 400 });
  }

  try {
    // connect to db
    const client = await clientPromise;
    const db = client.db("flatfinderdb");

    // find flat by id
    const flat = await db
      .collection("flats")
      .findOne({ _id: new ObjectId(id) });

    if (!flat) {
      return NextResponse.json({ error: "Flat not found" }, { status: 404 });
    }

    return NextResponse.json(flat);
  } catch (err) {
    console.error("error fetching flat:", err);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
