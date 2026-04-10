"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sub = exports.pub = exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const options = {
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null
};
// 🔹 Main client (general use)
exports.redis = new ioredis_1.default(options);
// 🔹 Pub/Sub clients (IMPORTANT for scaling)
exports.pub = new ioredis_1.default(options);
exports.sub = new ioredis_1.default(options);
//# sourceMappingURL=redis.js.map