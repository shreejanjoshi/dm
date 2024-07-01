"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
// the reason why we write Stripe in capitalized so that we can export the lowercase from this file and not get the naming config
var stripe_1 = __importDefault(require("stripe"));
// min : 9:29:00
exports.stripe = new stripe_1.default((_a = process.env.STRIPE_SECRET_KEY) !== null && _a !== void 0 ? _a : "", {
    apiVersion: "2024-06-20",
    typescript: true,
});
