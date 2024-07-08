import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [String],
    messages: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
});

const conversationModel = mongoose.model("Conversation", conversationSchema);

export default conversationModel