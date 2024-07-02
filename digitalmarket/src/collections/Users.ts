import { PrimaryActionEmailHtml } from "../components/emails/PrimaryActionEmail";
import { Access, CollectionConfig } from "payload/types";

// ------------------------------------------------------------
// ------------------------------------------------------------

const adminsAndUser: Access = ({ req: { user } }) => {
  if (user.role === "admin") return true;

  // u can access the user that matches the currently logged in user id which is yourself
  return {
    id: {
      equals: user.id,
    },
  };
};

// ------------------------------------------------------------
// ------------------------------------------------------------

export const Users: CollectionConfig = {
  // same as collection name in lower case
  slug: "users",

  // ------------------------------------------------------------

  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        // for email
        return PrimaryActionEmailHtml({
          actionLabel: "verify your account",
          buttonText: "Verify Account",
          href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`,
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
    create: () => true,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },

  // ------------------------------------------------------------

  // admin visibility setting
  admin: {
    // hidden from everyone who is not admoin
    hidden: ({ user }) => user.role !== "admin",
    // that is just going to change how this is displayed in the admin pannel but just a tiny details
    defaultColumns: ["id"],
  },

  // ------------------------------------------------------------

  fields: [
    {
      name: "products",
      label: "Products",
      admin: {
        condition: () => false,
      },
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
    {
      name: "product_files",
      label: "Product files",
      admin: {
        condition: () => false,
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
