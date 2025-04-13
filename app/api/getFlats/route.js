import clientPromise from "../../../db/database.js";
import Flat from "../../models/flat";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("flatfinderdb"); // <- your database name
    const flats = await db.collection("flats").find({}).toArray(); // use native driver here

    return NextResponse.json(flats);
  } catch (err) {
    console.error("Error fetching flats:", err);
    return NextResponse.json(
      { error: "Failed to fetch flats" },
      { status: 500 }
    );
  }
}
