// app/api/bookmark/route.js
import { addBookmark } from '../../../lib/bookmark'; // Adjust path if needed

export async function POST(req) {
  try {
    const { userId, flatId } = await req.json(); // Retrieve JSON body from the request

    const updatedUser = await addBookmark(userId, flatId);

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
