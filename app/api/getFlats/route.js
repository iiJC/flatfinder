import clientPromise from "../../../db/database.js";
import { NextResponse } from "next/server";

// in-memory cache
let flatsCache = null;
let lastFetch = 0;
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

export async function GET() {
  try {
    const now = Date.now();

    // return cached data if fresh
    if (flatsCache && now - lastFetch < CACHE_DURATION) {
      return NextResponse.json(flatsCache);
    }

    // connect to db and fetch flats
    const client = await clientPromise;
    const db = client.db("flatfinderdb");
    const flats = await db.collection("flats").find({}).toArray();

    // update cache
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
