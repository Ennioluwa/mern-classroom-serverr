const User = require("../models/user");
const { hashPassword, comparePassword } = require("../utils/auth");
const { extend } = require("lodash");

const create = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    req.body.password = await hashPassword(req.body.password);
    if (!name) return res.status(400).send({ error: "Name is required" });
    if (!password || password.length < 6) {
      return res.status(400).send({
        error: "Password is required and should be min 6 characters long",
      });
    }
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send({ error: "Email is taken" });
    const user = new User(req.body);
    await user.save();
    user.password = undefined;
    console.log(user);
    return res.status(200).json("Successfully signed up");
  } catch (error) {
    console.log(error);
  }
};

const list = async (req, res, next) => {
  try {
    let users = await User.find().select("name email created updated");
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};
const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).select("-password").exec();
    console.log("CURRENT_USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

const userById = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status(400).json({
        error: "User not found",
      });
    req.profile = user;
    next();
  } catch (error) {
    console.log(error);
  }
};

const read = async (req, res, next) => {
  // console.log(req);
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    return res.json(user);
  } catch (err) {
    console.log(err);
  }
};

const update = (req, res) => {
  const { name, password, educator } = req.body;
  if (password && password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be greater than 6 characters" });
  }
  console.log(educator);
  User.findById(req.user._id, async function (err, data) {
    if (err || !data) {
      return res.status(401).send({ error: "User not found." });
    }
    // if (password && data.authenticate(password)) {
    //   return res.status(400).json({
    //     error:
    //       "Password cannot be the same as the previous password. Please use a different password",
    //   });
    // }
    if (password) {
      var newUser = extend(data, { password, name, educator });
    } else {
      var newUser = extend(data, { name, educator });
    }
    try {
      await newUser.save();
      return res
        .status(200)
        .json({ message: "Updated successfully", data: newUser });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: "Error updating user" });
    }
  });
};
const remove = async (req, res, next) => {
  try {
    let user = req.profile;
    let deletedUser = await user.remove();
    console.log(deletedUser);
    deletedUser.password = undefined;
    res.json(deletedUser);
  } catch (error) {
    console.log(error);
  }
};

const isEducator = async (req, res, next) => {
  const id = req.user._id;
  user.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(401).send({ error: "User not found." });
    }
    if (user.educator) {
      next();
    } else {
      return res.status(401).send({ error: "User not an educator." });
    }
  });
};

module.exports = {
  create,
  list,
  read,
  remove,
  isEducator,
  currentUser,
  update,
  userById,
};
