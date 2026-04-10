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
exports.getStats = exports.restore = exports.listVersions = exports.getDiagram = exports.saveDiagram = void 0;
const service = __importStar(require("./diagram.service"));
const saveDiagram = async (req, res) => {
    const { projectId } = req.params;
    const { data } = req.body;
    const version = await service.saveVersion(projectId, data);
    res.json(version);
};
exports.saveDiagram = saveDiagram;
const getDiagram = async (req, res) => {
    const { projectId } = req.params;
    const diagram = await service.getLatestDiagram(projectId);
    res.json(diagram);
};
exports.getDiagram = getDiagram;
const listVersions = async (req, res) => {
    const { projectId } = req.params;
    const versions = await service.getVersions(projectId);
    res.json(versions);
};
exports.listVersions = listVersions;
const restore = async (req, res) => {
    const { versionId } = req.params;
    const userId = req.user.userId;
    const version = await service.restoreVersion(versionId, userId);
    res.json(version);
};
exports.restore = restore;
const getStats = async (req, res) => {
    const userId = req.user.userId;
    const stats = await service.getStats(userId);
    res.json(stats);
};
exports.getStats = getStats;
//# sourceMappingURL=diagram.controller.js.map