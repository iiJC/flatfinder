import clientPromise from "@/db/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("flatfinderdb");
    const flats = await db.collection("flats").find({}).toArray();

    return NextResponse.json(flats);
  } catch (err) {
    console.error("Failed to fetch flats:", err);
    return NextResponse.json(
      { error: "Failed to fetch flats" },
      { status: 500 }
    );
  }
}
