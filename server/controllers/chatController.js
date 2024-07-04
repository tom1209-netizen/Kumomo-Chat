import Chat from '../models/Chat.js';
import User from '../models/User.js'
import UserChat from '../models/UserChat.js';
import { getCurrentTime } from '../utils/time.js';
import { generateChatId } from '../utils/chatIDGenerator.js';
import cloudinary from '../config/cloudinaryConfig.js';

// Create a new chat
export const createChat = async (req, res) => {
  const { userIds } = req.body;
  const chatId = generateChatId(userIds[0], userIds[1]);

  const newChat = new Chat({
    chatId,
    userIds,
    messages: []
  });

  try {
    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  const { chatId, senderId, content } = req.body;
  const timestamp = getCurrentTime();

  let fileUrl = '';
  let cloudinaryPublicId = null;

  if (req.file) {
    const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const fileName = `${senderId}-${chatId}-${Date.now()}`;

    try {
      const result = await cloudinary.uploader.upload(dataUrl, {
        public_id: fileName,
        folder: req.file.mimetype.startsWith('audio/') ? 'user_sent_audio' : 'user_sent_image',
        resource_type: 'auto',
      });

      if (result) {
        fileUrl = result.secure_url;
        cloudinaryPublicId = result.public_id;
      }
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      return res.status(500).json({ message: 'Error uploading file' });
    }
  }

  const message = {
    content,
    senderId,
    timestamp,
    img: req.file && req.file.mimetype.startsWith('image/') ? fileUrl : '',
    audio: req.file && req.file.mimetype.startsWith('audio/') ? fileUrl : '',
  };

  try {
    const chat = await Chat.findOneAndUpdate(
      { chatId },
      { $push: { messages: message } },
      { new: true, upsert: true }
    );

    await updateUserChats(chatId, senderId, message);
    res.status(200).json(message);
  } catch (error) {
    if (cloudinaryPublicId) {
      await cloudinary.uploader.destroy(cloudinaryPublicId);
    }

    res.status(500).json({ message: 'Server error', error });
  }
};

export const getChatMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const chat = await Chat.findOne({ chatId });
    if (chat) {
      res.status(200).json(chat.messages);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateUserChats = async (chatId, senderId, message) => {
  const timestamp = getCurrentTime();

  // Fetch sender and receiver details
  const sender = await User.findById(senderId);
  const otherUserId = getOtherUserId(chatId, senderId);
  const receiver = await User.findById(otherUserId);

  // Create userChat object for the sender
  const senderChatUpdate = {
    [`chats.${chatId}.lastMessage`]: {
      content: message.content || 'Image',
    },
    [`chats.${chatId}.timestamp`]: timestamp,
    [`chats.${chatId}.userInfo`]: {
      _id: receiver._id,
      userName: receiver.userName,
      photoURL: receiver.photoURL,
    },
  };

  // Create userChat object for the receiver
  const receiverChatUpdate = {
    [`chats.${chatId}.lastMessage`]: {
      content: message.content || 'Image',
    },
    [`chats.${chatId}.timestamp`]: timestamp,
    [`chats.${chatId}.userInfo`]: {
      _id: sender._id,
      userName: sender.userName,
      photoURL: sender.photoURL,
    },
  };

  // Update the sender's chat information
  await UserChat.findOneAndUpdate(
    { userId: senderId },
    { $set: senderChatUpdate },
    { upsert: true }
  );

  // Update the receiver's chat information
  await UserChat.findOneAndUpdate(
    { userId: otherUserId },
    { $set: receiverChatUpdate },
    { upsert: true }
  );
};

export const getUserChats = async (req, res) => {
  const { userId } = req.params;
  try {
    const userChats = await UserChat.findOne({ userId });
    if (userChats) {
      res.status(200).json(userChats.chats);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getOtherUserId = (chatId, senderId) => {
  return chatId.replace(senderId, '');
};