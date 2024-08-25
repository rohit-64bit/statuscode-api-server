const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    chatID: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    sentBy: {
        type: String,
        required: true,
        enum: ['user', 'agent']
    },
    isFile: {
        type: Boolean,
        default: false
    },
    fileLink: {
        type: String
    }
})

module.exports = mongoose.model('Message', MessageSchema);