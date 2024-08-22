const express = require("express");
const isAuthenticated = require("../middlewares/isAuthentication");
const Users = require("../schema/userSchema");
const Messages = require("../schema/messagesSchema");
const multer = require("multer");
// const { sendVideoImageMessage } = require("../index");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({}),
});

// router.post(
//   "/send-message",
//   upload.array("image"),
//   isAuthenticated,
//   async (req, res) => {
//     try {
//       const message = req.body;

//       if (!message)
//         return res.send({ success: false, message: "No message found" });

//       const user = await Users.findOne({ email: req.user.email });

//       if (!user) return res.send({ success: false, message: "User not found" });

//       if (message.messageType == "text") {
//         const newMessage = await new Messages(message).save();
//         return res.send({
//           success: true,
//           message: "Message sent successfully",
//         });
//       }

//       if (message.messageType == "imageVideo") {
//         if (!req.files) {
//           return res.send({ success: false, message: "Please select a file" });
//         }

//         // Save the message with image/video
//         const { members, sender, receiver, messageType } = req.body;

//         try {
//           req.files.map(async (file) => {
//             try {
//               const result = await cloudinary.uploader.upload(
//                 file.path,
//                 file?.mimetype?.split("/")[0] == "video" && {
//                   resource_type: "video",
//                 }
//               );
//               console.log(result);
//               const newMessage = new Messages({
//                 members: JSON.parse(members),
//                 sender: JSON.parse(sender),
//                 receiver: JSON.parse(receiver),
//                 messageType: file?.mimetype?.split("/")[0],
//                 url: result.secure_url,
//               });
//               sendVideoImageMessage(newMessage);
//               await newMessage.save();
//               console.log(result);
//             } catch (error) {
//               console.log("error in uploading", error.message);
//             }
//           });
//         } catch (error) {
//           console.log("error in uploading", error.message);
//         }

//         // await uploading();
//         return res.send({
//           success: true,
//           message: "Message with image/video sent successfully",
//         });
//       }
//     } catch (error) {
//       return res.send({ success: false, message: error.message });
//     }
//   }
// );

router.post("/get-messages", async (req, res) => {
  try {
    const { user1, user2 } = req.body;
    const messages = await Messages.find({ members: { $all: [user1, user2] } });
    return res.send({ success: true, message: "all messages get", messages });
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
});

module.exports = router;
