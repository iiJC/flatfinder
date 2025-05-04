import clientPromise from "../../../db/database.js";
import { NextResponse } from "next/server";

let flatsCache = null;
let lastFetch = 0;
const CACHE_DURATION = 1000 * 60 * 10; 

export async function GET() {
  try {
    const now = Date.now();

    if (flatsCache && now - lastFetch < CACHE_DURATION) {
      return NextResponse.json(flatsCache);
    }

    const client = await clientPromise;
    const db = client.db("flatfinderdb");
    const flats = await db.collection("flats").find({}).toArray();

    flatsCache = flats;
    lastFetch = now;

    return NextResponse.json(flats);
  } catch (err) {
    console.error("Error fetching flats:", err);
    return NextResponse.json(
      { error: "Failed to fetch flats" },
      { status: 500 }
    );
  }
}
