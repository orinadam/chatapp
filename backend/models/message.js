const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        required: [true, "you must send a message with text"]
    },
    date: {
        type: Date
    },
    seen: {
        type: Boolean
    }

});

module.exports = mongoose.model('Message', MessageSchema);