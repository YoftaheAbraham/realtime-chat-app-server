import conversationModel from "../models/conversation.model.js";
import groupModel from "../models/group.model.js";
import userModel from "../models/user.model.js"
import { updateUser } from "../utils/EditUser.js";

export const getUserData = async (req, res) => {
    const { id: userID } = req.user
    try {
        const userData = await userModel.findById(userID);
        if (userData) {
            const chats = await conversationModel.find({ participants: userID });
            const NotMe = chats.map((item) => {
                return item.participants.find((item => item != userID))
            });
            const NotMeOperation = NotMe.map((item) => {
                return { userID: item }
            });
            let data = [];
            if (NotMeOperation.length >= 1) {
                const chatDatas = await userModel.find({ $or: NotMeOperation })
                data = chatDatas
            }
            const myGroups = await groupModel.find({ ownerID: userID });
            const joinedGroups = await groupModel.find({ members: userID })
            res.json({
                status: "success",
                userData,
                chats: data,
                myGroups,
                joinedGroups,
                data
            });
        } else {
            res.json({
                status: "fail",
                message: "User does no longer exist!"
            })
        }
    } catch (error) {
        res.json({
            status: "fail",
            message: error.message
        })
    }
}


export const getSearchQuery = async (req, res) => {
    const { id: userID } = req.user
    const { q } = req.query;
    try {
        // const users = await userModel.find({ $or: [{ username: { $regex: q } }, { full_name: { $regex: q } }, { email: { $regex: q } }] });
        const users = await userModel.aggregate([
            {
                $match: {
                    $or: [{ username: { $regex: q } }, { full_name: { $regex: q } }, { email: { $regex: q } }],
                }
            },
            {
                $match: {
                    userID: { $ne: userID }
                }
            }
        ]);
        const groups = await groupModel.find({ $or: [{ groupUsername: { $regex: q } }, { groupName: { $regex: q } }] });
        res.json({
            status: "success",
            users,
            groups
        })
    } catch (error) {
        res.json({
            status: "fail",
            message: error.message
        })
    }
}
export const getSingleUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await userModel.findById(id)
        // const groups = await groupModel.find({ $or: [{ groupUsername: { $regex: q } }, { groupName: { $regex: q } }] });
        res.json({
            status: "success",
            user
            // groups
        })
    } catch (error) {
        res.json({
            status: "fail",
            message: error.message
        })
    }
}


export const update = async (req, res) => {
    const { id: userID } = req.user
    try {
        const response = await updateUser(userID, req.body.full_name, req.body.username, req.body.profile_picture)
        res.json(response)
    } catch (error) {
        res.json({
            status: "fail",
            message: error.message
        })
    }
}