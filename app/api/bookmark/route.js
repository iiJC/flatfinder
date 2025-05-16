//app\api\bookmark\route.js

import { addBookmark, removeBookmark } from '../../../lib/bookmark';

export async function POST(request) {
  try {
    const { userId, flatId, action } = await request.json();

    // Validate inputs
    if (!userId || !flatId || !action) {
      return new Response(JSON.stringify({ 
        error: "Missing required parameters: userId, flatId, action" 
      }), {
        status: 400,
      });
    }

    let result;
    if (action === 'add') {
      result = await addBookmark(userId, flatId);
    } else if (action === 'remove') {
      result = await removeBookmark(userId, flatId);
    } else {
      return new Response(JSON.stringify({ 
        error: "Invalid action. Must be 'add' or 'remove'" 
      }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in bookmark route:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Server error processing bookmark" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
