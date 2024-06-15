import mongoose from 'mongoose';

const userChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  chats: {
    type: Map,
    of: {
      userInfo: {
        uid: { type: mongoose.Schema.Types.ObjectId, required: true },
        userName: { type: String, required: true },
        photoURL: { type: String, default: '' },
      },
      lastMessage: {
        content: { type: String, default: '' },
      },
      timestamp: {
        date: { type: String, default: '' },
        time: { type: String, default: '' },
      },
    },
  },
});

const UserChat = mongoose.model('UserChat', userChatSchema);

export default UserChat;