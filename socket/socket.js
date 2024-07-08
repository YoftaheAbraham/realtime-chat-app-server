import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors"
import { sendPrivateMessageUtility, sendPublicMessageUtility } from "../utils/sendMessage.js";
import { updateUser } from "../utils/EditUser.js";
import { AddGroupMember } from "../utils/AddMember.js";

const app = express();
app.use(cors());

let onlineUsers = {};
let GroupRooms = []

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const getSocketId = (receiver) => {
    return onlineUsers[receiver]
}

io.on("connection", async (socket) => {
    let user = socket.handshake.query
    let connectedUser;
    try {
        if (user.user && user.user != undefined) {
            connectedUser = { ...JSON.parse(user.user), socketID: socket.id }
            delete onlineUsers[connectedUser.userID]
            if (!onlineUsers[connectedUser.userID]) {
                onlineUsers[connectedUser.userID] = socket.id
                io.emit("onlineUsers", onlineUsers);
            }
        }
        socket.on("send-message-private", async (data) => {
            const messageData = await sendPrivateMessageUtility(connectedUser.userID, data.receiverID, data.message)
            if (messageData.status == "success") {
                io.to(getSocketId(data.receiverID)).emit("get-message-private", messageData)
            }
        });
        socket.on("added-to-group", async (data) => {
            const response = await AddGroupMember(data.groupID, data.memberID);
            if (response.status == "success") {
                io.to(onlineUsers[data.memberID]).emit("added-to-group", response);
            }
        });
        socket.on("join_group", (data) => {
            if (data && data.groupID) {
                if (GroupRooms.includes(data.groupID)) {
                    socket.join(data.groupID)
                } else {
                    GroupRooms.push(data.groupID)
                    socket.join(data.groupID)
                }
            }
        });
        socket.on("send-message-public", async (data) => {
            const messageData = await sendPublicMessageUtility(data.senderID, data.groupID, data.message)
            if (messageData.status == "success") {
                const groupRoom = GroupRooms.find((item) => item == data.groupID);
                if (groupRoom) {
                    io.to(groupRoom).emit("get-message-public", messageData)
                } else {
                    GroupRooms.push(data.groupID)
                }
            }
        })

        socket.on("disconnect", () => {
            delete onlineUsers[connectedUser.userID]
            io.emit("leftUsers", connectedUser.userID)
        })
    } catch (error) {
        return
    }
})

export { app, server };
