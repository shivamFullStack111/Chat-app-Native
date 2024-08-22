const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoute");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const messageRouter = require("./routes/messageRoute");
const isAuthenticated = require("./middlewares/isAuthentication");
const Users = require("./schema/userSchema");
const Messages = require("./schema/messagesSchema");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(messageRouter);
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/chat-mobile-app")
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => console.log(err));

// Create HTTP server
const server = http.createServer(app);

const userToSocketId = new Map();
let activeUsers = [];

const addActiveUser = (user, socketId) => {
  userToSocketId.set(user._id, socketId);
  activeUsers = [...activeUsers, user];
  console.log(activeUsers, "add function");
};

const removeActiveUser = (user) => {
  userToSocketId.delete(user._id);
  activeUsers = activeUsers.filter((us) => us._id !== user._id);
  console.log(activeUsers, "delete function");
};

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for testing
    methods: ["GET", "POST"], // Allow GET and POST methods
  },
});
let sockett;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  sockett = socket;
  // Handle user addition
  socket.on("add-me", (user) => {
    socket.user = user; // Store user in socket instance
    addActiveUser(user, socket.id);
    io.emit("activeUsers", activeUsers);
  });

  // Handle receiving a message
  socket.on("message", (message) => {
    const socketid = userToSocketId.get(message.receiver._id);
    if (!socketid) return;
    console.log(socketid);
    socket.to(socketid).emit("newMessage", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    if (socket.user) {
      removeActiveUser(socket.user);
      io.emit("activeUsers", activeUsers);
    }
  });
});
// const sendVideoImageMessage = function (message) {
//   console.log("emiting...");
//   const socketId = userToSocketId.get(message.receiver._id);
//   if (socketId) {
//     io.to(socketId).emit("videoImageMessage", message);
//   }
// };
// Start the server
server.listen(9000, () => {
  console.log(`Server is running on port 9000`);
});

const upload = multer({
  storage: multer.diskStorage({}),
});

app.post(
  "/send-message",
  upload.array("image"),
  isAuthenticated,
  async (req, res) => {
    try {
      console.log("first");
      const message = req.body;

      if (!message)
        return res.send({ success: false, message: "No message found" });

      const user = await Users.findOne({ email: req.user.email });

      if (!user) return res.send({ success: false, message: "User not found" });

      if (message.messageType == "text") {
        const newMessage = await new Messages(message).save();
        return res.send({
          success: true,
          message: "Message sent successfully",
        });
      }

      if (message.messageType == "imageVideo") {
        if (!req.files) {
          return res.send({ success: false, message: "Please select a file" });
        }

        // Save the message with image/video
        const { members, sender, receiver, messageType } = req.body;

        try {
          req.files.map(async (file) => {
            try {
              const result = await cloudinary.uploader.upload(
                file.path,
                file?.mimetype?.split("/")[0] == "video" && {
                  resource_type: "video",
                }
              );
              const newMessage = new Messages({
                members: JSON.parse(members),
                sender: JSON.parse(sender),
                receiver: JSON.parse(receiver),
                messageType: file?.mimetype?.split("/")[0],
                url: result.secure_url,
              });

              sockett.emit("videoImageMessage", newMessage);
              const socketId = userToSocketId.get(newMessage.receiver._id);
              console.log("receiver id=------", newMessage.receiver._id);
              console.log("receiver id=------", socketId);
              if (socketId) {
                sockett.to(socketId).emit("newMessage", newMessage);
              }
              await newMessage.save();
              console.log(result.secure_url);
            } catch (error) {
              console.log("error in uploading", error);
            }
          });
        } catch (error) {
          console.log("error in uploading", error.message);
        }

        // await uploading();
        return res.send({
          success: true,
          message: "Message with image/video sent successfully",
        });
      }
    } catch (error) {
      return res.send({ success: false, message: error.message });
    }
  }
);

app.post(
  "/send-audio",
  isAuthenticated,
  upload.single("image"),
  async (req, res) => {
    try {
      const { newMessage } = req.body;
      const message = JSON.parse(newMessage);
      console.log(newMessage);

      if (!req.file)
        return res.send({ success: false, message: "please send am audio" });

      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "video",
        });

        console.log(result.secure_url);
        message.url = result.secure_url;

        const socketId = userToSocketId.get(message.receiver._id);
        console.log("message =------", message.receiver._id);
        console.log("receiver id=------", socketId);
        if (socketId) {
          sockett.to(socketId).emit("newMessage", message);
        }

        await new Messages(message).save();
      } catch (error) {
        console.log("errror in uploading audio: " + error.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
);

// module.exports = { sendVideoImageMessage };
