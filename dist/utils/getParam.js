"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParam = void 0;
const getParam = (param) => {
    if (Array.isArray(param))
        return param[0];
    return param;
};
exports.getParam = getParam;
//# sourceMappingURL=getParam.js.map