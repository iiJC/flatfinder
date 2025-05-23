import clientPromise from "../../../db/database";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { ObjectId } from "mongodb"; // needed for user id

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // parse form data from request
    const formData = await req.formData();

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("flatfinderdb");

    // Get the user from DB to access _id
    const user = await db
      .collection("users")
      .findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // create flat object from form data
    const flat = {
      name: formData.get("flat_name"),
      address: formData.get("address"),
      location: formData.get("location"),
      rent_per_week: formData.get("rent_per_week"),
      bond: formData.get("bond"),
      rooms: formData.get("rooms"),
      available_rooms: formData.get("available_rooms"),
      features: formData.get("features"),
      description: formData.get("description"),
      tags: formData.getAll("tags[]"),
      distance_from_uni: formData.get("distance_from_uni"),
      distance_from_gym: formData.get("distance_from_gym"),
      distance_from_supermarket: formData.get("distance_from_supermarket"),
      utilities_included: formData.get("utilities_included"),
      coordinates: JSON.parse(formData.get("coordinates")),
      ownerId: user._id // ✅ Store user ID as owner
    };

    // convert image files to base64, handles multiple images
    const imageFiles = formData.getAll("images");
    const imageBuffers = [];

    for (const imageFile of imageFiles) {
      if (typeof imageFile.arrayBuffer === "function") {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        imageBuffers.push({
          image: buffer.toString("base64"),
          imageType: imageFile.type
        });
      }
    }

    flat.images = imageBuffers;

    // insert flat into db
    const flatResult = await db.collection("flats").insertOne(flat);
    const flatId = flatResult.insertedId;

    // Optionally save the flat ID to the user doc, links flat to user
    await db
      .collection("users")
      .updateOne({ _id: user._id }, { $set: { listing: flatId } });

    return NextResponse.json(
      {
        success: true,
        message: "Flat added successfully!",
        insertedId: flatId
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Failed to add flat:", err);
    return NextResponse.json(
      { success: false, message: "Error adding flat." },
      { status: 500 }
    );
  }
}
