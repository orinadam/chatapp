const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true
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
    await Review.deleteMany({
      _id: {
        $in: doc.messages,
      },
    });
  }
});

module.exports = mongoose.model("Chat", ChatSchema);
