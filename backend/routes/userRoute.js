const express = require("express");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const multer = require("multer");
const Users = require("../schema/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const isAuthenticated = require("../middlewares/isAuthentication");

const router = express.Router();

cloudinary.config({
  cloud_name: "dyvoxcqpt",
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const upload = multer({
  storage: multer.diskStorage({}),
});

router.post("/register", upload.single("image"), async (req, res) => {
  try {
    console.log("first");
    const { name, email, password } = req.body;

    const isExist = await Users.findOne({ email: email });

    if (isExist)
      return res.send({ success: false, message: "user already registered" });

    if (!req.file)
      return res.send({
        success: false,
        message: "please select a profile image",
      });

    const result = await cloudinary.uploader.upload(req.file.path);

    const hashpassword = await bcrypt.hash(password, 10);

    const newuser = await new Users({
      name,
      email,
      password: hashpassword,
      image: result.secure_url,
    }).save();

    return res.send({ success: true, message: "registration successful" });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const isExist = await Users.findOne({ email });

    if (!isExist)
      return res.send({ success: false, message: "user detail not found" });

    const ismatch = await bcrypt.compare(password, isExist.password);

    if (!ismatch)
      return res.send({
        success: false,
        message: "email or password mismatch",
      });

    const user = await Users.findOne({ email }).select("-password");

    const token = await jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.send({ success: true, message: "login successful", token });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

router.get("/get-user", isAuthenticated, async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.user.email }).select(
      "-password"
    );

    if (!user) return res.send({ success: false, message: "user not found" });

    return res.send({ success: true, message: "user is authorized", user });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

router.get("/get-all-users", async (req, res) => {
  try {
    const users = await Users.find({}).select("-password");
    return res.send({ success: true, users, message: "all users" });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

module.exports = router;
