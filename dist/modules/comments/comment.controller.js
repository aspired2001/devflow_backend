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
exports.getNodeComments = exports.getProjectComments = exports.createComment = void 0;
const service = __importStar(require("./comment.service"));
const getParam_1 = require("../../utils/getParam");
const createComment = async (req, res) => {
    const { content, parentId, nodeId } = req.body;
    const projectId = (0, getParam_1.getParam)(req.params.projectId);
    const userId = req.user.userId;
    const comment = await service.addComment(content, projectId, userId, parentId, nodeId);
    res.json(comment);
};
exports.createComment = createComment;
const getProjectComments = async (req, res) => {
    const projectId = (0, getParam_1.getParam)(req.params.projectId);
    const comments = await service.fetchProjectComments(projectId);
    res.json(comments);
};
exports.getProjectComments = getProjectComments;
const getNodeComments = async (req, res) => {
    const nodeId = (0, getParam_1.getParam)(req.params.nodeId);
    const comments = await service.fetchNodeComments(nodeId);
    res.json(comments);
};
exports.getNodeComments = getNodeComments;
//# sourceMappingURL=comment.controller.js.map