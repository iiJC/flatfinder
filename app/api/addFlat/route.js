import clientPromise from "../../../db/database";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Get form data
    const formData = await req.formData();

    // Extract flat details from form
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
      tags: formData.getAll("tags[]"),  // Multiple tags
      distance_from_uni: formData.get("distance_from_uni"),
      distance_from_gym: formData.get("distance_from_gym"),
      distance_from_supermarket: formData.get("distance_from_supermarket"),
      utilities_included: formData.get("utilities_included"),
      coordinates: JSON.parse(formData.get("coordinates")),  // Parsing JSON object
    };

    // Handle multiple images
    const imageFiles = formData.getAll("images"); // This will be an array of files
    console.log("Image files received:", imageFiles);  // Log the received files

    const imageBuffers = [];
    
    for (const imageFile of imageFiles) {
      if (typeof imageFile.arrayBuffer === "function") {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        imageBuffers.push({
          image: buffer.toString("base64"),
          imageType: imageFile.type, // Save image MIME type
        });
      }
    }

    flat.images = imageBuffers;  // Store all images in the flat object
    console.log("Flat object with images:", flat);  // Log the flat object

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("flatfinderdb");
    const collection = db.collection("flats");

    // Insert flat document into MongoDB
    const result = await collection.insertOne(flat);
    console.log("Insertion result:", result);  // Log the insertion result

    return NextResponse.json(
      {
        success: true,
        message: "Flat added successfully!",
        insertedId: result.insertedId,
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
