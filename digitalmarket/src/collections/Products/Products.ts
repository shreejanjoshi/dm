import { PRODUCT_CATEGORIES } from "@/config";
import { CollectionConfig } from "payload/types";

export const Products: CollectionConfig = {
  // table name in lower case
  slug: "products",
  admin: {
    // name field that we  are going to create for default value
    useAsTitle: "name",
  },
  // who can access which parts of which products, can anyone download product? no right
  access: {},
  fields: [
    {
      // each product has user who craete this product
      name: "user",
      // connect to user table to the product table
      type: "relationship",
      //   ti whome
      relationTo: "users",
      //   always have to have user with aproduct otherwise we could have unknown produccts and we dont know who created this
      required: true,
      //   one product cannot create by many people
      hasMany: false,
      //   going to hide this field from the admin dashboard
      admin: {
        condition: () => false,
      },
    },
    {
      // each product will have a name
      name: "name",
      //   lable is which is visiable in admin dashboard
      label: "Name",
      type: "text",
      //   every product has to have a name
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      label: "Product details",
    },
    {
      name: "price",
      label: "Price in USD",
      min: 0,
      max: 1000,
      type: "number",
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
      required: true,
    },
    {
      name: "product_files",
      label: "Product file(s)",
      type: "relationship",
      required: true,
      relationTo: "product_files",
      //   false => each product will have exactly one product file if you want to allow for multiple product files like for ex icon set in multiple different file formats all you have to do is change this to true
      hasMany: false,
    },
    {
      // need to verify from admin
      name: "approvedForSale",
      label: "Product Status",
      type: "select",
      defaultValue: "pending",
      //   only admin should change options value so we do this
      //    cms payload provides
      access: {
        // not a boolen but a function
        // regular user can only see the status
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
      options: [
        {
          label: "Pending verification",
          value: "pending",
        },
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Denied",
          value: "denied",
        },
      ],
    },
    {
      // where we can handle the checkout data for payments
      name: "priceId",
      access: {
        // no admin or other user can change this only owner can
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },
    {
      name: "stripeId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },
  ],
};
