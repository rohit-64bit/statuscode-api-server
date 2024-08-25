const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AgentSchema = new Schema({

    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profileImg: {
        type: String,
        default: ""
    },
    files: [{
        type: String
    }],
    commission: {
        type: Number,
        required: true
    }

}, {
    timestamps: true
})

AgentSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this.id, type: "agent" }, process.env.JWT_SECRET);
    return token;
}

AgentSchema.methods.updatePassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt);

    await this.save();
}

AgentSchema.methods.updateProfile = async function (data) {

    let agent = this;

    if (data.name) {
        agent.name = data.name;
    }

    if (data.type) {
        agent.type = data.type;
    }

    if (data.bio) {
        agent.bio = data.bio;
    }

    if (data.commission) {
        agent.commission = data.commission;
    }

    if (data.profileImg) {
        agent.profileImg = data.profileImg;
    }

    if (data.files) {
        agent.files = data.files;
    }

    await agent.save();
}

module.exports = mongoose.model('Agent', AgentSchema);