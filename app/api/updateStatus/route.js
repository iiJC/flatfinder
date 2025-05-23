// pages/api/applications/updateStatus.js

import clientPromise from "../../../db/database.js";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    const { applicationId } = req.body; // Assuming you send the applicationId in the body
    if (!applicationId) {
      return res.status(400).json({ error: "Application ID is required." });
    }

    try {
      const client = await clientPromise;
      const db = client.db("flatfinderdb");

      // Update the application status
      const result = await db
        .collection("applications")
        .updateOne(
          { _id: new ObjectId(applicationId) },
          { $set: { status: "acknowledged" } }
        );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Application not found." });
      }

      return res
        .status(200)
        .json({ message: "Application acknowledged successfully." });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
