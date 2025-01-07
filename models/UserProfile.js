import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  bio: String,
  profileImage: String
}, { timestamps: true });

export default mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);

