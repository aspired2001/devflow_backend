"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDiagramHandlers = void 0;
const redis_1 = require("../config/redis");
const registerDiagramHandlers = (io, socket) => {
    socket.on("join_project", (projectId) => {
        socket.join(projectId);
    });
    socket.on("diagram_update", ({ projectId, data }) => {
        redis_1.pub.publish("diagram_updates", JSON.stringify({ projectId, data }));
    });
    socket.on("cursor_move", ({ projectId, cursor }) => {
        socket.to(projectId).emit("cursor_move", {
            userId: socket.id,
            cursor
        });
    });
};
exports.registerDiagramHandlers = registerDiagramHandlers;
//# sourceMappingURL=diagram.socket.js.map