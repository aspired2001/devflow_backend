"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller = __importStar(require("./diagram.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const ownership_middleware_1 = require("../../middlewares/ownership.middleware");
const router = (0, express_1.Router)();
router.get("/stats", auth_middleware_1.authMiddleware, controller.getStats);
router.post("/:projectId/save", auth_middleware_1.authMiddleware, ownership_middleware_1.checkProjectOwnership, controller.saveDiagram);
router.get("/:projectId", auth_middleware_1.authMiddleware, ownership_middleware_1.checkProjectOwnership, controller.getDiagram);
router.get("/:projectId/versions", auth_middleware_1.authMiddleware, ownership_middleware_1.checkProjectOwnership, controller.listVersions);
router.post("/restore/:versionId", auth_middleware_1.authMiddleware, controller.restore);
exports.default = router;
//# sourceMappingURL=diagram.routes.js.map