const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    agentID: {
        type: Schema.Types.ObjectId,
        ref: 'Agent',
        required: true
    },
    recentMessage: {
        type: String,
        default: ""
    },
    recentMessageTime: {
        type: Date,
    },
    recentMessageBy:{
        type: String,
        required: true,
        enum: ['user', 'agent']
    },
    
})