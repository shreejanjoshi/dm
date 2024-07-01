"use strict";
// 4.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// install slate and bulder for our backend and also mogodb
// npm add @payloadcms/richtext-slate @payloadcms/bundler-webpack @payloadcms/db-mongodb
// npm add -D nodemon : look in left hand side build new file in root folder name it nodemon.json
// after that also create tsconfig.server.ts file
var bundler_webpack_1 = require("@payloadcms/bundler-webpack");
var db_mongodb_1 = require("@payloadcms/db-mongodb");
var richtext_slate_1 = require("@payloadcms/richtext-slate");
var path_1 = __importDefault(require("path"));
var config_1 = require("payload/config");
var Users_1 = require("./collections/Users");
var dotenv_1 = __importDefault(require("dotenv"));
var Products_1 = require("./collections/Products/Products");
var ProductFile_1 = require("./collections/ProductFile");
var Media_1 = require("./collections/Media");
var Orders_1 = require("./collections/Orders");
// ------------------------------------------------------------
// ------------------------------------------------------------
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../.env"),
});
// ------------------------------------------------------------
exports.default = (0, config_1.buildConfig)({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
    // ------------------------------------------------------------
    //   this will be later our product , user and so on very important
    collections: [Users_1.Users, Products_1.Products, Media_1.Media, ProductFile_1.ProductFiles, Orders_1.Orders],
    // ------------------------------------------------------------
    routes: {
        admin: "/sell",
    },
    // ------------------------------------------------------------
    admin: {
        user: "users",
        bundler: (0, bundler_webpack_1.webpackBundler)(),
        meta: {
            titleSuffix: "- DigitalMarket",
            favicon: "/favicon.ico",
            ogImage: "/thumbnail.jpg",
        },
    },
    // ------------------------------------------------------------
    rateLimit: {
        // for production we can always adjust it by default it is 500 so for now devlopemt we make it high
        max: 2000,
    },
    // ------------------------------------------------------------
    //   lexical or slate 2 options
    editor: (0, richtext_slate_1.slateEditor)({}),
    // ------------------------------------------------------------
    db: (0, db_mongodb_1.mongooseAdapter)({
        url: process.env.MONGODB_URL,
    }),
    // ------------------------------------------------------------
    //   all our types will live so the entire app is going to be completely type safe from front to back becasue it is typescript cms
    // put all ours types of user, products in this file
    typescript: {
        outputFile: path_1.default.resolve(__dirname, "payload-types.ts"),
    },
});
