import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet'
import { app, server } from './socket/socket.js';
import AuthRoute from './routes/auth.route.js';
import mongoose from 'mongoose';
import ConversationRoute from './routes/conversations.route.js';
import getAllDatas from './routes/AllUserDatas.route.js';
dotenv.config();

const PORT = process.env.SERVER_PORT || 6600;
app.use(express.json());
app.use(helmet());
app.use('/api/auth', AuthRoute)
app.use('/api/data', getAllDatas)
app.use('/api/conversation', ConversationRoute)


mongoose.connect(process.env.MONGODB_CONNECTION_STRING).then(() => {
    console.log("connected to mongoDB")
    server.listen(PORT, () => {
        console.log(`SERVER IS RUNNING AT PORT ${PORT}...`);
    })
}).catch(err => console.log("Error occured while connecting to mongodb"))