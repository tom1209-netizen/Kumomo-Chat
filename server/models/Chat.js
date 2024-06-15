import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  senderId: { type: String, required: true },
  timestamp: { 
    date: { type: String, default: '' },
    time: { type: String, default: '' },
  },
  img: { type: String, default: '' },
});

const chatSchema = new mongoose.Schema({
  chatId: { type: String, unique: true, required: true }, 
  userIds: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
  messages: [messageSchema],
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;