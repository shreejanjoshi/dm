import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  // same as collection name in lower case
  slug: "users",
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return `<a href="${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}">Verify account</a>`;
      },
    },
  },
  // only right people can see right data
  access: {
    // true any one can create or read
    read: () => true,
    create: () => true,
  },
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
