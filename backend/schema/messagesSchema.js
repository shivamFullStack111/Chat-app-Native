const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    members: Array,
    sender: Object,
    receiver: Object,
    messageType: String,
    text: String,
    url: String,
  },
  { timestamps: true }
);

const Messages = mongoose.model("Messages", messageSchema);
module.exports = Messages;
