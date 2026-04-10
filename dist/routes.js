"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const project_routes_1 = __importDefault(require("./modules/projects/project.routes"));
const diagram_routes_1 = __importDefault(require("./modules/diagrams/diagram.routes"));
const comment_routes_1 = __importDefault(require("./modules/comments/comment.routes"));
const adr_routes_1 = __importDefault(require("./modules/adr/adr.routes"));
const ai_routes_1 = __importDefault(require("./modules/ai/ai.routes"));
const router = (0, express_1.Router)();
router.use("/auth", auth_routes_1.default);
router.use("/projects", project_routes_1.default);
router.use("/diagrams", diagram_routes_1.default);
router.use("/comments", comment_routes_1.default);
router.use("/adr", adr_routes_1.default);
router.use("/ai", ai_routes_1.default);
exports.default = router;
//# sourceMappingURL=routes.js.map