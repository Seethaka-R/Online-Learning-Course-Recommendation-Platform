// controllers/authController.js — Register, login, get/update profile
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @desc  Register new user
// @route POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, skills, interests, experienceLevel } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ success: false, message: 'Email already registered' });

  const user = await User.create({ name, email, password, skills, interests, experienceLevel });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      interests: user.interests,
      experienceLevel: user.experienceLevel,
      token: generateToken(user._id),
    },
  });
};

// @desc  Login user
// @route POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      interests: user.interests,
      experienceLevel: user.experienceLevel,
      token: generateToken(user._id),
    },
  });
};

// @desc  Get current user profile
// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, data: req.user });
};

// @desc  Update profile (skills, interests, bio, experienceLevel)
// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const { name, bio, skills, interests, experienceLevel } = req.body;
  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (skills) user.skills = skills;
  if (interests) user.interests = interests;
  if (experienceLevel) user.experienceLevel = experienceLevel;

  const updated = await user.save();
  res.json({ success: true, data: updated });
};

module.exports = { register, login, getMe, updateProfile };