const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    sender: Object,
    receiver: Object,
    isSeen: Boolean,
    notitficationType: String,
  },
  { timestamps: true }
);

const Notifications = mongoose.model("Notifications", notificationSchema);
module.exports = Notifications;