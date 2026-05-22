const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// @desc    Register new admin
// @route   POST /api/auth/register
// @access  Public (Should be restricted in production)
const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if admin exists
  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    res.status(400);
    throw new Error('Admin already exists');
  }

  // Create admin
  const admin = await Admin.create({
    name,
    email,
    password,
  });

  if (admin) {
    res.status(201).json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid admin data');
  }
};

// @desc    Authenticate an admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  // Check for admin email
  const admin = await Admin.findOne({ email }).select('+password');

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin.id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
};

// @desc    Get admin data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.admin);
};

// @desc    Get all admins
// @route   GET /api/auth/admins
// @access  Private
const getAdmins = async (req, res) => {
  const admins = await Admin.find({}, 'name email');
  res.status(200).json(admins);
};

// @desc    Update admin profile
// @route   PUT /api/auth/me
// @access  Private
const updateAdmin = async (req, res) => {
  const admin = await Admin.findById(req.admin.id);

  if (admin) {
    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;
    
    if (req.body.password) {
      admin.password = req.body.password;
    }

    const updatedAdmin = await admin.save();

    res.json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      token: generateToken(updatedAdmin._id),
    });
  } else {
    res.status(404);
    throw new Error('Admin not found');
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getMe,
  getAdmins,
  updateAdmin,
};
