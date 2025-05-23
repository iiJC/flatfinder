import clientPromise from "@/db/database";
import { ObjectId } from "mongodb";

export async function GET(request, context) {
  try {
    // get flat id from route params
    const params = await context.params;
    const { id } = params;

    // check if id is valid
    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), {
        status: 400
      });
    }

    const client = await clientPromise;
    const db = client.db("flatfinderdb");

    const flat = await db
      .collection("flats")
      .findOne({ _id: new ObjectId(id) });

    if (!flat) {
      return new Response(JSON.stringify({ error: "Flat not found" }), {
        status: 404
      });
    }

    // return flat data
    return new Response(JSON.stringify(flat), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in GET /api/flats/[id]:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500
    });
  }
}
