import mongoose from "mongoose";

const publicMessageSchema = new mongoose.Schema({
    senderID: {
        type: String,
        ref: "User",
        required: true
    },
    sender_full_name: {
        type: String
    },
    sender_username: {
        type: String
    },
    groupID: {
        type: String,
        ref: "Group",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    messageID: String
}, {
    timestamps: true
});

publicMessageSchema.pre("save", function (next) {
    this.messageID = this._id
    next()
})

const publicMessageModel = mongoose.model("PublicMessage", publicMessageSchema);

export default publicMessageModel