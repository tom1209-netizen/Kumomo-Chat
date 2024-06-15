import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinaryConfig.js';

// Handle user registration
export const registerUser = async (req, res) => {
  const { userName, email, password, language } = req.body;
  
  if (!userName || !email || !password || !language) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  let photoURL = null;
  let cloudinaryPublicId = null;

  if (req.file) {
    const dataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const fileName = `${userName}-${Date.now()}`;

    try {
      const result = await cloudinary.uploader.upload(dataUrl, {
        public_id: fileName,
        folder: 'user_profile_pictures',
        resource_type: 'auto',
      });

      if (result) {
        photoURL = result.secure_url; 
        cloudinaryPublicId = result.public_id;
      }
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      return res.status(500).json({ message: 'Error uploading image' });
    }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      userName,
      email,
      password: hashedPassword,
      language,
      photoURL,
    });
    console.log(user)

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (cloudinaryPublicId) {
      await cloudinary.uploader.destroy(cloudinaryPublicId);
    }

    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Can't find user" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id, userName: user.userName, email: user.email }, 'watermelon', { expiresIn: '1h' });

    res.status(200).json({ token, user: { id: user._id, userName: user.userName, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Fetch user's language preference
export const getUserLanguage = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json({ language: user.language });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Search users by username
export const searchUsers = async (req, res) => {
  const { username } = req.query;

  try {
    const users = await User.find({ userName: { $regex: username, $options: 'i' } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};