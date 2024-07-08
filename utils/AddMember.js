import groupModel from "../models/group.model.js"

export const AddGroupMember = async (groupID, memberID) => {
    const group = await groupModel.findById(groupID)
    console.log(group);
    console.log(groupID, memberID);
    if (!group) {
        return ({
            status: 'fail',
            message: "The group does no longer exist!"
        })
    } else if (group.members.includes(memberID)) {
        return ({
            status: 'fail',
            message: "User has already joined the group!"
        })
    } else {
        await groupModel.findByIdAndUpdate(groupID, {
            $push: {
                members: memberID
            }
        });
        return ({
            status: "success",
            message: "success fully added group member",
            data: group
        })
    }
}