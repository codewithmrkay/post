import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema({
  fileName: String,
  fileType: String,
  fileData: String, // We'll store the file as a base64 string
  likes: Number,
  views: Number,
  comments: Number,
  shares: Number,
}, { timestamps: true });

export default mongoose.models.Media || mongoose.model('Media', MediaSchema);

