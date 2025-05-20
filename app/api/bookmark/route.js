// app/api/bookmark/route.js
import { ObjectId } from "mongodb";
import clientPromise from "@/db/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { flatId, action } = await request.json();
    
    if (!flatId || !action) {
      return Response.json({ error: "Missing parameters" }, { status: 400 });
    }

    if (!ObjectId.isValid(flatId)) {
      return Response.json({ error: "Invalid flat ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("flatfinderdb");

    // Update user's bookmarks
    const update = action === 'add'
      ? { $addToSet: { bookmarks: new ObjectId(flatId) } }
      : { $pull: { bookmarks: new ObjectId(flatId) } };

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(session.user.id) },
      update
    );

    if (result.modifiedCount === 0) {
      return Response.json({ error: "Update failed" }, { status: 400 });
    }

    return Response.json({
      success: true,
      isBookmarked: action === 'add'
    });

  } catch (error) {
    console.error("Bookmark error:", error);
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}