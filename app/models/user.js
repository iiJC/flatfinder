
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flat',
    },
  ],
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
