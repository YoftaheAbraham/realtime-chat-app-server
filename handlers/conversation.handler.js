import conversationModel from "../models/conversation.model.js";
import groupModel from "../models/group.model.js";
import privateMessageModel from "../models/privateMessages.model.js";
import publicMessageModel from "../models/publicMessages.model.js";
import userModel from "../models/user.model.js";
import { AddGroupMember } from "../utils/AddMember.js";
import { sendPrivateMessageUtility, sendPublicMessageUtility } from "../utils/sendMessage.js";
export const createConversation = async (req, res) => {
    const { id: receiverID } = req.params;
    const { id: senderID } = req.user;

    try {
        const receiver = await userModel.findById(receiverID);
        if (receiverID == senderID) {
            res.status(403).json({
                status: "fail",
                messageData: "You can't create chat with your self"
            })
        } else {
            if (receiver) {
                let conversation = await conversationModel.findOne({ participants: { $all: [senderID, receiverID] } });
                if (!conversation) {
                    conversation = await conversationModel.create({
                        participants: [senderID, receiverID]
                    })
                    res.json({
                        status: "success",
                        conversation
                    })
                } else {
                    res.status(403).json({
                        status: "fail",
                        message: "You already have conversation with this user"
                    })
                }
            } else {
                res.json({
                    status: "fail",
                    messageData: "User does no longer exist!"
                })
            }

        }
    } catch (error) {
        res.json({
            status: "fail",
            messageData: error.message
        })
    }
}

export const sendMessagePrivate = async (req, res) => {
    const message = req.body.message;
    const { id: receiverID } = req.params;
    const { id: senderID } = req.user;

    try {
        const response = await sendPrivateMessageUtility(senderID, receiverID, message)
        res.json(response)
    } catch (error) {
        res.json({
            status: "fail",
            messageData: error.message
        })
    }
}
export const getMessagePrivate = async (req, res) => {
    const message = req.body.message;
    const { id: receiverID } = req.params;
    const { id: senderID } = req.user;
    try {
        const user = await userModel.findById(receiverID)
        let conversation = await conversationModel.findOne({ participants: { $all: [senderID, receiverID] } });
        if (user && conversation.messages) {
            const messages = await privateMessageModel.aggregate([
                {
                    $match: {
                        messageID: {
                            $in: conversation.messages
                        }
                    }
                },
                {
                    $addFields: {
                        isMyMessage: {
                            $cond: {
                                if: { $eq: [senderID, "$senderID"] },
                                then: true,
                                else: false
                            }
                        }
                    }
                }
            ])
            res.json({
                status: "success",
                user,
                messages
            })
        } else {
            res.json({
                status: "fail",
                message: "User does not longer exist, Send message to start the conversation",
            })

        }
    } catch (error) {
        res.json({
            status: "fail",
            messageData: error.message
        })
    }
}

export const createGroup = async (req, res) => {
    const { id: creatorID } = req.user;
    try {
        const creator = await userModel.findById(creatorID);
        if (creator) {
            const group = await groupModel.create({
                ownerID: creator.userID,
                groupName: req.body.groupName,
                groupUsername: req.body.groupUsername
            });
            res.json({
                status: "success",
                message: "Successfully created your group",
                data: group
            })
        } else {
            res.status(403).json({
                status: 'fail',
                message: "Can't create your group"
            })
        }

    } catch (error) {
        if (error.code == 11000) {
            res.status(400).json({
                status: 'fail',
                message: "Group with the same username already exists, please provide a unique one!"
            })
        } else if (error._message == "Group validation failed") {
            res.status(403).json({
                status: 'fail',
                message: "Please provide all the necessary fields(data) to your group"
            })
        } else {
            res.status(403).json({
                status: 'fail',
                message: error.message
            })
        }
    }
}

export const sendMessagePublic = async (req, res) => {
    const message = req.body.message;
    const { id: groupID } = req.params;
    const { id: senderID } = req.user;
    try {
        const response = await sendPublicMessageUtility(senderID, groupID, message);
        res.json(response)
    } catch (error) {
        res.json({
            status: "fail",
            messageData: error.message
        })
    }
}
export const getMessagePublic = async (req, res) => {
    const { id: groupID } = req.params;
    const { id: ownerID } = req.user;
    try {
        const group = await groupModel.aggregate([
            {
                $match: {
                    groupID
                }
            },
            {
                $addFields: {
                    numberOfMembers: {
                        $size: "$members"
                    }
                }
            }
        ]);
        if (group) {
            const messages = await publicMessageModel.aggregate([
                {
                    $match: {
                        messageID: {
                            $in: group[0].messages
                        }
                    }
                },
                {
                    $addFields: {
                        isMyMessage: {
                            $cond: {
                                if: { $eq: [ownerID, "$senderID"] },
                                then: true,
                                else: false
                            }
                        }
                    }
                }
            ])
            res.json({
                status: "success",
                messages,
                group: group[0],
                isMyGroup: group[0].ownerID == ownerID,
                isJoined: group[0].members.includes(ownerID)
            })
        }

    } catch (error) {
        res.json({
            status: "fail",
            messageData: error.message
        })
    }
}