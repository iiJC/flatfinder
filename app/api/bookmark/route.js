// app/api/bookmark/route.js
export async function POST(request) {
  try {
    const { userId, flatId, action } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(userId) || 
        !mongoose.Types.ObjectId.isValid(flatId)) {
      return Response.json({ error: "Invalid ID format" }, { status: 400 });
    }

    let result;
    if (action === 'add') {
      result = await addBookmark(userId, flatId);
    } else if (action === 'remove') {
      result = await removeBookmark(userId, flatId);
    } else {
      return Response.json({ error: "Invalid action" }, { status: 400 });
    }

    return Response.json({
      success: true,
      isBookmarked: action === 'add',
      user: result
    });

  } catch (error) {
    return Response.json({ 
      error: error.message,
      success: false
    }, { status: 500 });
  }
}