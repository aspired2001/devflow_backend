"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const db_1 = require("../../config/db");
const hash_1 = require("../../utils/hash");
const jwt_1 = require("../../utils/jwt");
const signup = async (email, password) => {
    const hashed = await (0, hash_1.hashPassword)(password);
    const user = await db_1.prisma.user.create({
        data: { email, password: hashed }
    });
    return (0, jwt_1.generateToken)(user.id);
};
exports.signup = signup;
const login = async (email, password) => {
    const user = await db_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("User not found");
    const valid = await (0, hash_1.comparePassword)(password, user.password);
    if (!valid)
        throw new Error("Invalid password");
    return (0, jwt_1.generateToken)(user.id);
};
exports.login = login;
//# sourceMappingURL=auth.service.js.map