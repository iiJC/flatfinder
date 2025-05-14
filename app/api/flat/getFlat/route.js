import { getServerSession } from "next-auth";
import clientPromise from "@/db/database";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ flat: null }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("flatfinderdb");

    const flat = await db
      .collection("flats")
      .findOne({ userEmail: session.user.email });

    return NextResponse.json({ flat });
  } catch (err) {
    console.error("Error fetching user flat:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
