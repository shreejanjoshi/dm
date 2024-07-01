"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trpc = void 0;
var react_query_1 = require("@trpc/react-query");
// <> genric contain entrity of backendµ
// front end know the type of backend
exports.trpc = (0, react_query_1.createTRPCReact)({});
