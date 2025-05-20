// app/api/bookmark/route.js
import { ObjectId } from "mongodb";
import clientPromise from "@/db/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.error("Unauthorized: No session found");
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { flatId, action } = await request.json();
    
    if (!flatId || !action) {
      console.error("Bad Request: Missing parameters", { flatId, action });
      return Response.json({ error: "Missing parameters" }, { status: 400 });
    }

    if (!ObjectId.isValid(flatId)) {
      console.error("Bad Request: Invalid flat ID", flatId);
      return Response.json({ error: "Invalid flat ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("flatfinderdb");
    const userId = new ObjectId(session.user.id);
    const flatObjectId = new ObjectId(flatId);

    const userExists = await db.collection("users").countDocuments({ _id: userId });
    if (!userExists) {
      console.error("User not found", { userId: session.user.id });
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const update = action === 'add'
      ? { $addToSet: { bookmarks: flatObjectId } }
      : { $pull: { bookmarks: flatObjectId } };

    const result = await db.collection("users").updateOne(
      { _id: userId },
      update
    );

    console.log("Update result:", {
      userId: session.user.id,
      flatId,
      action,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });

    if (result.matchedCount === 0) {
      console.error("User document not found for update");
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      success: true,
      isBookmarked: action === 'add',
      changed: result.modifiedCount > 0,
      bookmarkCount: await db.collection("users").countDocuments({
        _id: userId,
        bookmarks: flatObjectId
      })
    });

  } catch (error) {
    console.error("Bookmark operation failed:", error);
    return Response.json(
      { 
        error: error.message || "Internal server error",
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}