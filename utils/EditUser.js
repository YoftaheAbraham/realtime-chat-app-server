import userModel from "../models/user.model.js"
import validator from "validator"
export const updateUser = async (userID, full_name, userName, profile_picture) => {
    try {
        let username = userName.split(" ").join("");
        username.split("").forEach((item, index) => {
            if (typeof parseInt(item) != "number") {
                username[index] = ""
            }
        })
        if (validator.isAlpha(username)) {
            await userModel.findByIdAndUpdate(userID, { full_name, username, profile_picture });
            const foundUser = await userModel.findById(userID)
            return { chat: foundUser, full_name, username, status: "success" }
        } else {
            return {status: "fail", message: "username can't have number" }
        }
    } catch (error) {
        if (error.code == 11000) {
            return { status: "fail", message: "This username is already in use, please provide a unique one" }
        } else {
            return { status: "fail", message: error.message }
        }
    }
}