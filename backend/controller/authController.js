const User = require('../models/user'); // lowercase 'user.js'
const bcrypt = require('bcrypt');

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed });
    await user.save();

    res.status(201).json({ msg: "Signup success", user });
  } catch (err) {
    res.status(500).json({ msg: "Signup failed", error: err });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ msg: "Invalid password" });

    res.status(200).json({ msg: "Login success", user });
  } catch (err) {
    res.status(500).json({ msg: "Login failed", error: err });
  }
};
