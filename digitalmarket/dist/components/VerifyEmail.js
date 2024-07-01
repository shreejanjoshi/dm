"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@/trpc/client");
var lucide_react_1 = require("lucide-react");
var image_1 = __importDefault(require("next/image"));
var link_1 = __importDefault(require("next/link"));
var button_1 = require("./ui/button");
var VerifyEmail = function (_a) {
    var token = _a.token;
    // happen in backend: look in auth-router.ts
    var _b = client_1.trpc.auth.verifyEmail.useQuery({
        token: token,
    }), data = _b.data, isLoading = _b.isLoading, isError = _b.isError;
    if (isError) {
        return (React.createElement("div", { className: "flex flex-col items-center gap-2" },
            React.createElement(lucide_react_1.XCircle, { className: "h-8 w-8 text-red-600" }),
            React.createElement("h3", { className: "font-semibold text-xl" }, "There was a problem"),
            React.createElement("p", { className: "text-muted-foreground text-sm" }, "This token is not valid or might be expired. Please try again.")));
    }
    if (data === null || data === void 0 ? void 0 : data.success) {
        return (React.createElement("div", { className: "flex h-full flex-col items-center justify-center" },
            React.createElement("div", { className: "relative mb-4 h-60 w-60 text-muted-foreground" },
                React.createElement(image_1.default, { src: "/hippo-email-sent.png", fill: true, alt: "the email was sent" })),
            React.createElement("h3", { className: "font-semibold text-2xl" }, "You're all set!"),
            React.createElement("p", { className: "text-muted-foreground text-center mt-1" }, "Thank you for verifying your email."),
            React.createElement(link_1.default, { className: (0, button_1.buttonVariants)({ className: "mt-4" }), href: "/sign-in" }, "Sign in")));
    }
    if (isLoading) {
        return (React.createElement("div", { className: "flex flex-col items-center gap-2" },
            React.createElement(lucide_react_1.Loader2, { className: "animate-spin h-8 w-8 text-zinc-300" }),
            React.createElement("h3", { className: "font-semibold text-xl" }, "Verifying..."),
            React.createElement("p", { className: "text-muted-foreground text-sm" }, "This won't take long.")));
    }
};
exports.default = VerifyEmail;
