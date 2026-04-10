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
exports.updateProject = exports.deleteProject = exports.listProjects = exports.createProject = void 0;
const service = __importStar(require("./project.service"));
const createProject = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.userId;
    const project = await service.createProject(name, userId);
    res.json(project);
};
exports.createProject = createProject;
const listProjects = async (req, res) => {
    const userId = req.user.userId;
    const projects = await service.listProjects(userId);
    res.json(projects);
};
exports.listProjects = listProjects;
const deleteProject = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    await service.deleteProject(id, userId);
    res.json({ message: "deleted" });
};
exports.deleteProject = deleteProject;
const updateProject = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.userId;
    const project = await service.updateProject(id, name, userId);
    res.json(project);
};
exports.updateProject = updateProject;
//# sourceMappingURL=project.controller.js.map