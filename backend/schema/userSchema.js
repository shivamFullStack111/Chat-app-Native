const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    image: String,
    friends: Array,
    lastmessages: [
      {
        type: Object,
        senderid: String,
        lastmessage: {
          type: Object,
          type: String,
          message: String,
          url: String,
        },
        createdAt: Date.now(),
      },
    ],
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
