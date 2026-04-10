"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateADR = exports.getProjectADR = exports.createADR = void 0;
const db_1 = require("../../config/db");
const createADR = (data) => {
    return db_1.prisma.adr.create({ data });
};
exports.createADR = createADR;
const getProjectADR = (projectId) => {
    return db_1.prisma.adr.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" }
    });
};
exports.getProjectADR = getProjectADR;
const updateADR = (id, data) => {
    return db_1.prisma.adr.update({
        where: { id },
        data
    });
};
exports.updateADR = updateADR;
//# sourceMappingURL=adr.repository.js.map