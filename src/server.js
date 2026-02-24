require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDb = require("./db/db");
const { initializeSocket } = require("./sockets/socket.server");

connectDb();

const server = http.createServer(app);
initializeSocket(server);

server.listen(3000, () => {
    console.log("Server started on port 3000");
});