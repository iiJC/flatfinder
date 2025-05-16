import User from '../app/models/user'; 

export async function addBookmark(userId, flatId) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.bookmarks.addToSet(flatId); 

    await user.save();

    return user; 
  } catch (error) {
    console.error("Error adding bookmark:", error);
    throw new Error("Error adding bookmark");
  }
}
