import { compare } from "bcrypt";
import userModel from "../models/user.model.js";
import { createToken } from "../utils/jwt.js";
import { AddGroupMember } from "../utils/AddMember.js";

export const signupHandler = async (req, res) => {
    const userData = {
        username: req.body.username,
        full_name: req.body.full_name,
        password: req.body.password,
        gender: req.body.gender
    }
    try {
        const user = userModel(userData);
        await Promise.all([user.save(), AddGroupMember(process.env.BASE_GROUP_ID, user._id)])
        console.log(process.env.BASE_GROUP_ID, user.userID);
        const token = createToken({
            id: user._id,
        }, process.env.JWT_SECRET)
        res.json({
            status: "success",
            data: user,
            token
        });
    } catch (error) {
        if (error.code == 11000) {
            res.status(400).json({
                status: 'fail',
                message: "This username is already in use, Please provide a unique one!"
            })
        } else {
            res.status(403).json({
                status: 'fail',
                message: error.message
            })
        }
    }
}
export const loginHandler = async (req, res) => {
    const userData = {
        username: req.body.username,
        password: req.body.password,
    }
    try {
        const data = await userModel.find({ username: userData.username }).select("+password");
        if (!data[0]) {
            res.json({
                status: "fail",
                message: "user with the provided username does no longer exist"
            });
        } else {
            const isCorrect = await compare(userData.password, data[0].password)
            if (!isCorrect) {
                res.status(403).json({
                    status: "fail",
                    message: "Incorrect password!"
                });
            } else if (isCorrect) {
                const token = createToken({ id: data[0]._id }, process.env.JWT_SECRET)
                res.json({
                    status: "success",
                    data: data[0],
                    token
                });
            } else {
                res.status(403).json({
                    status: "fail",
                    message: "Can't login right now"
                });
            }
        }
    } catch (error) {
        res.status(403).json({
            status: 'fail',
            message: error.message
        })
    }
}