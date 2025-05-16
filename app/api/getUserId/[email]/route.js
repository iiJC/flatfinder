import clientPromise from "@/db/database";

export async function GET(request, context) {
  try {
    const { email } = await context.params;

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Invalid or missing email" }), {
        status: 400,
      });
    }

    const decodedEmail = decodeURIComponent(email);

    const client = await clientPromise;
    const db = client.db("flatfinderdb");

    const user = await db.collection("users").findOne({ email: decodedEmail });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ userId: user._id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET /api/users/[email]:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
