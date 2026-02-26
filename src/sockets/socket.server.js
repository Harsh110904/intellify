const { Server } = require("socket.io");
const cookie = require("cookie")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const aiService = require("../services/ai.service")
const messageModel = require("../models/message.model")
let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    io.use(async (socket, next) => {
        try {
            // Support both cookie tokens (browsers) and handshake auth tokens (Postman)
            const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
            const token = cookies.token || socket.handshake.auth?.token;

            console.log("Socket connection token:", token ? "Token received" : "No token");

            if (!token) {
                return next(new Error("Authentication error: No token provided"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.userId);

            socket.user = user;
            next(); // SUCCESS! Let the socket connect

        } catch (err) {
            console.error("Socket auth error:", err.message);
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`New client connected: ${socket.id}`);

        // Example event listeners can be added here
        socket.on("ai-message", async (messagePayload) => {
            try {
                // Determine if Postman sent it as a raw string or an object
                const payload = typeof messagePayload === 'string' ? JSON.parse(messagePayload) : messagePayload;
                console.log("Parsed payload:", payload);

                if (!payload.content) {
                    console.error("No prompt (content) provided!");
                    return;
                }

                await messageModel.create({
                    chat: payload.chat,
                    user: socket.user._id,
                    content: payload.content,
                    role: "user"
                })
                // Fetch chat history BEFORE calling Gemini
                const chatHistory = await messageModel.find({
                    chat: payload.chat
                }).sort({ createdAt: -1 }).limit(20).lean().reverse()

                // Call Gemini
                const response = await aiService.generateResult(chatHistory.map(item => {
                    return {
                        role: item.role,
                        parts: [{ text: item.content }]
                    }
                }));
                console.log("Gemini Response:", response);

                await messageModel.create({
                    chat: payload.chat,
                    user: socket.user._id,
                    content: payload.content,
                    role: "model"
                })

                // Emit the response back to the client
                socket.emit("ai-response", { response });
            } catch (error) {
                console.error("Error with AI request:", error.message);
            }
        });


        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = {
    initializeSocket,
    getIo
};
