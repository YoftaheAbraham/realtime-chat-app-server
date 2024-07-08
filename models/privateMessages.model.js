import mongoose from "mongoose";

const privateMessageSchema = new mongoose.Schema({
    senderID: {
        type: String,
        required: true
    },
    receiverID: {
        type: String,
        required: true
    },
    message: {
        type: String
    },
    messageID: {
        type: String
    }
}, {
    timestamps: true
});

privateMessageSchema.pre("save", function(next) {
    this.messageID = this._id
    next()
})

const privateMessageModel = mongoose.model("PrivateMessage", privateMessageSchema);

export default privateMessageModel