import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    chatroomId: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    sender: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model('Message', messageSchema)