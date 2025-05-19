//lib\bookmark.js

import mongoose from 'mongoose';
import User from '../app/models/user';

async function getUser(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }

  const user = await User.findById(userId).select('bookmarks');
  if (!user) {
    throw new Error(`User not found with ID: ${userId}`);
  }
  return user;
}

export async function addBookmark(userId, flatId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId) || 
        !mongoose.Types.ObjectId.isValid(flatId)) {
      throw new Error("Invalid ID format");
    }

    const user = await getUser(userId);

    if (user.bookmarks.some(b => b.toString() === flatId.toString())) {
      throw new Error(`Flat ${flatId} already bookmarked by user ${userId}`);
    }

    user.bookmarks.addToSet(new mongoose.Types.ObjectId(flatId));
    await user.save();
    return { success: true, user };
  } catch (error) {
    console.error(`Error adding bookmark (user: ${userId}, flat: ${flatId}):`, error);
    throw error;
  }
}

export async function removeBookmark(userId, flatId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId) || 
        !mongoose.Types.ObjectId.isValid(flatId)) {
      throw new Error("Invalid ID format");
    }

    const user = await getUser(userId);

    if (!user.bookmarks.some(b => b.toString() === flatId.toString())) {
      throw new Error(`Flat ${flatId} not found in user ${userId}'s bookmarks`);
    }

    user.bookmarks.pull(new mongoose.Types.ObjectId(flatId));
    await user.save();
    return { success: true, user };
  } catch (error) {
    console.error(`Error removing bookmark (user: ${userId}, flat: ${flatId}):`, error);
    throw error;
  }
}

export async function checkBookmark(userId, flatId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId) || 
        !mongoose.Types.ObjectId.isValid(flatId)) {
      throw new Error("Invalid ID format");
    }

    const user = await User.findById(userId).select('bookmarks');
    if (!user) {
      throw new Error("User not found");
    }
    
    const isBookmarked = user.bookmarks.some(
      bookmark => bookmark.toString() === flatId.toString()
    );

    return {
      isBookmarked,
      bookmarkCount: user.bookmarks.length
    };
  } catch (error) {
    console.error("Error checking bookmark:", error);
    throw error;
  }
}