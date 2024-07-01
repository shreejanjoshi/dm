"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
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
                return "<a href=\"".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-email?token=").concat(token, "\">Verify account</a>");
            },
        },
    },
    // ------------------------------------------------------------
    // only right people can see right data
    access: {
        // true any one can create or read
        read: function () { return true; },
        create: function () { return true; },
    },
    // ------------------------------------------------------------
    fields: [
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
