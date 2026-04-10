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
exports.updateADR = exports.listADR = exports.createADR = void 0;
const service = __importStar(require("./adr.service"));
const getParam_1 = require("../../utils/getParam");
const createADR = async (req, res) => {
    const projectId = (0, getParam_1.getParam)(req.params.projectId);
    const userId = req.user.userId;
    const adr = await service.createADR(projectId, userId, req.body);
    res.json(adr);
};
exports.createADR = createADR;
const listADR = async (req, res) => {
    const projectId = (0, getParam_1.getParam)(req.params.projectId);
    const adr = await service.listADR(projectId);
    res.json(adr);
};
exports.listADR = listADR;
const updateADR = async (req, res) => {
    const id = (0, getParam_1.getParam)(req.params.id);
    const adr = await service.updateADR(id, req.body);
    res.json(adr);
};
exports.updateADR = updateADR;
//# sourceMappingURL=adr.controller.js.map