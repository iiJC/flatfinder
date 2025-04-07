import clientPromise from "../../../db/database";  // This goes up 3 levels from app/api/addFlat/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Get the data from the request body
    const flat = await req.json();

    // Wait for the database connection
    const client = await clientPromise;
    const db = client.db("flatfinderdb");  // Use the database name
    const collection = db.collection("flats"); // Access the "flats" collection

    // Insert the flat data into the collection
    await collection.insertOne(flat);

    // Return a success response
    return NextResponse.json({ success: true, message: "Flat added!" }, { status: 201 });
  } catch (err) {
    console.error("Failed to add flat:", err);
    return NextResponse.json({ success: false, message: "Error adding flat." }, { status: 500 });
  }
}