//lib\bookmark.js

import mongoose from 'mongoose';
import User from '../app/models/user';

async function getUser(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User not found with ID: ${userId}`);
  }
  return user;
}

export async function addBookmark(userId, flatId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(flatId)) {
      throw new Error("Invalid flat ID format");
    }

    const user = await getUser(userId);

    if (user.bookmarks.includes(flatId)) {
      throw new Error(`Flat ${flatId} already bookmarked by user ${userId}`);
    }

    user.bookmarks.addToSet(flatId);
    await user.save();
    return user;
  } catch (error) {
    console.error(`Error adding bookmark (user: ${userId}, flat: ${flatId}):`, error);
    throw error;
  }
}

export async function removeBookmark(userId, flatId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(flatId)) {
      throw new Error("Invalid flat ID format");
    }

    const user = await getUser(userId);

    if (!user.bookmarks.includes(flatId)) {
      throw new Error(`Flat ${flatId} not found in user ${userId}'s bookmarks`);
    }

    user.bookmarks.pull(flatId);
    await user.save();
    return user;
  } catch (error) {
    console.error(`Error removing bookmark (user: ${userId}, flat: ${flatId}):`, error);
    throw error;
  }
}

export async function checkBookmark(userId, flatId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(flatId)) {
      throw new Error("Invalid flat ID format");
    }

    const user = await getUser(userId);
    const isBookmarked = user.bookmarks.includes(flatId);

    return {
      userId,
      flatId,
      isBookmarked,
      bookmarkCount: user.bookmarks.length
    };
  } catch (error) {
    console.error(`Error checking bookmark (user: ${userId}, flat: ${flatId}):`, error);
    throw error;
  }
}
