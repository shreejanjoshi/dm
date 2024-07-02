"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
var PrimaryActionEmail_1 = require("../components/emails/PrimaryActionEmail");
// ------------------------------------------------------------
// ------------------------------------------------------------
var adminsAndUser = function (_a) {
    var user = _a.req.user;
    if (user.role === "admin")
        return true;
    // u can access the user that matches the currently logged in user id which is yourself
    return {
        id: {
            equals: user.id,
        },
    };
};
// ------------------------------------------------------------
// ------------------------------------------------------------
exports.Users = {
    // same as collection name in lower case
    slug: "users",
    // ------------------------------------------------------------
    auth: {
        verify: {
            generateEmailHTML: function (_a) {
                var token = _a.token;
                // for email
                return (0, PrimaryActionEmail_1.PrimaryActionEmailHtml)({
                    actionLabel: "verify your account",
                    buttonText: "Verify Account",
                    href: "".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-email?token=").concat(token),
                });
            },
        },
    },
    // ------------------------------------------------------------
    // only right people can see right data
    access: {
        // who should be able to read a user and the answer is admin and the user itself
        read: adminsAndUser,
        // true beacuse anyone is allowed to sign up to our services
        create: function () { return true; },
        update: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
        delete: function (_a) {
            var req = _a.req;
            return req.user.role === "admin";
        },
    },
    // ------------------------------------------------------------
    // admin visibility setting
    admin: {
        // hidden from everyone who is not admoin
        hidden: function (_a) {
            var user = _a.user;
            return user.role !== "admin";
        },
        // that is just going to change how this is displayed in the admin pannel but just a tiny details
        defaultColumns: ["id"],
    },
    // ------------------------------------------------------------
    fields: [
        {
            name: "products",
            label: "Products",
            admin: {
                condition: function () { return false; },
            },
            type: "relationship",
            relationTo: "products",
            hasMany: true,
        },
        {
            name: "product_files",
            label: "Product files",
            admin: {
                condition: function () { return false; },
            },
            type: "relationship",
            relationTo: "product_files",
            hasMany: true,
        },
        {
            name: "role",
            defaultValue: "user",
            required: true,
            // admin: {
            //   // visiable to only admin user
            //   // condition: ({ req }) => req.user.role == "admin",
            //   condition: () => false,
            // },
            type: "select",
            options: [
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
            ],
        },
    ],
};
