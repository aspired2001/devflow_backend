"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const diagram_socket_1 = require("./diagram.socket");
const redis_1 = require("../config/redis");
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: { origin: "*" }
    });
    io.on("connection", (socket) => {
        (0, diagram_socket_1.registerDiagramHandlers)(io, socket);
    });
    redis_1.sub.subscribe("diagram_updates");
    redis_1.sub.on("message", (channel, message) => {
        const { projectId, data } = JSON.parse(message);
        io.to(projectId).emit("diagram_update", data);
    });
    return io;
};
exports.initSocket = initSocket;
//# sourceMappingURL=index.js.map