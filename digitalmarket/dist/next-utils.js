"use strict";
// 3.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextHandler = exports.nextApp = void 0;
var next_1 = __importDefault(require("next"));
// define some utilies for next js
var PORT = Number(process.env.PORT) || 3000;
exports.nextApp = (0, next_1.default)({
    dev: process.env.NODE_ENV !== "production",
    port: PORT,
});
// to self host next app
exports.nextHandler = exports.nextApp.getRequestHandler();
