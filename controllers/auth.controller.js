const User = require("../models/user");
const { hashPassword, comparePassword } = require("../utils/auth");
const jwt = require("jsonwebtoken");

const signin = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: "User not found" });
    const match = await comparePassword(req.body.password, user.password);
    if (!match)
      return res.status(400).json({ error: "Email and password dont match" });
    const token = jwt.sign({ _id: user._id }, "hello", {
      expiresIn: "1d",
    });
    user.password = undefined;
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // only works on https
    });
    return res.json({ success: "Sign in successful", user });
  } catch (error) {
    return res.status(402).json({ error: "Could not sign in" });
  }
};

const signout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signout success" });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { signin, signout };
