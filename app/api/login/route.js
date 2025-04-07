import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // For password hashing
import clientPromise from "../../../db/database"; // Ensure this path is correct for your db connection file

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide both email and password." },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("flatfinderdb"); // Make sure you specify the correct DB name
    const usersCollection = db.collection("users");

    // Check if user exists in the database
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 400 }
      );
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 400 }
      );
    }

    // At this point, the login is successful, and you can set up session management or JWT tokens here
    return NextResponse.json(
      { success: true, message: "Login successful", userId: user._id },
      { status: 200 }
    );

  } catch (error) {
    console.error("Login failed:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during login." },
      { status: 500 }
    );
  }
}