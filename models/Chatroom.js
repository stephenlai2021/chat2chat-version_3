import mongoose from "mongoose";

const { Schema } = mongoose;

const chatroomSchema = new Schema(
  {
    lastImage: {
      type: String,
      required: true
    },
    lastMessage: {
      type: String,
      required: true
    },
    lastMessageSentTime: {
      type: String,
      required: true
    },
    newMessage: {
      type: String,
      required: true
    }, 
    users: {
      type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
      default: []
    },
    usersData: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.Chatroom || mongoose.model('Chatroom', chatroomSchema)