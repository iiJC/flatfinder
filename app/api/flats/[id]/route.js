import clientPromise from "@/db/database";
import { ObjectId } from "mongodb";

export async function GET(request, context) {
  try {
    const params = await context.params; // ✅ await this like the error says
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("flatfinderdb");

    const flat = await db.collection("flats").findOne({ _id: new ObjectId(id) });

    if (!flat) {
      return new Response(JSON.stringify({ error: "Flat not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(flat), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /api/flats/[id]:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
