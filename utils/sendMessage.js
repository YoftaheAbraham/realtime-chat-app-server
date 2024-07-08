import conversationModel from "../models/conversation.model.js";
import privateMessageModel from "../models/privateMessages.model.js";
import userModel from "../models/user.model.js";
import groupModel from "../models/group.model.js";
import publicMessageModel from "../models/publicMessages.model.js";

export const sendPrivateMessageUtility = async (senderID, receiverID, message) => {
    const receiver = await userModel.findById(receiverID);
    const sender = await userModel.findById(senderID)
    if (receiver) {
        let conversation = await conversationModel.findOne({ participants: { $all: [senderID, receiverID] } });
        if (!conversation) {
            conversation = await conversationModel.create({
                participants: [senderID, receiverID]
            })
        }
        const messageData = new privateMessageModel({
            senderID: senderID,
            receiverID: receiverID,
            message
        });
        conversation.messages.push(messageData._id);

        await Promise.all([messageData.save(), conversation.save()])
        return { status: "success", chat: sender, receiver, messageData }
    } else {
        return {
            status: "fail",
            messageData: "User does no longer exist!"
        }
    }
}

export const sendPublicMessageUtility = async (senderID, groupID, message) => {
    const user = await userModel.findById(senderID);

    if (!user) {
        return {
            status: "fail",
            message: "User does no longer exist"
        }
    } else {
        const group = await groupModel.findById(groupID);
        if (!group) {
            return {
                status: "fail",
                message: "Group does no longer exist"
            }
        } else if (!group.members.includes(senderID)) {
            return {
                status: 'fail',
                message: "You didn't join the group, Please join the group to send a message!"
            }
        } else {
            const messageData = new publicMessageModel({
                senderID: senderID,
                message,
                groupID: groupID,
                sender_full_name: user.full_name,
                sender_username: user.username
            })
            group.messages.push(messageData._id);
            await Promise.all([messageData.save(), group.save()])
            return {
                status: "success",
                message: messageData,
                group
            }
        }
    }
}