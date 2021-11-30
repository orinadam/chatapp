const mongoose = require("mongoose");
const Message = require("./message");

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

ChatSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Message.deleteMany({
      _id: {
        $in: doc.messages,
      },
    });
  }
});

module.exports = mongoose.model("Chat", ChatSchema);
