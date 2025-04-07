import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // For password hashing
import clientPromise from "../../../db/database"; // Make sure this path is correct for your db connection file

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide all required fields." },
        { status: 400 }
      );
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("flatfinderdb"); // Make sure you specify the DB name if needed
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists." },
        { status: 409 }
      );
    }

    // Insert the new user into the database
    const newUser = {
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    return NextResponse.json(
      { success: true, message: "User registered successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { success: false, message: "Error during registration." },
      { status: 500 }
    );
  }
}