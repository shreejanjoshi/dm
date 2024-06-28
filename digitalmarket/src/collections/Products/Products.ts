import {
  AfterChangeHook,
  BeforeChangeHook,
} from "payload/dist/collections/config/types";
import { PRODUCT_CATEGORIES } from "../../config";
import { Access, CollectionConfig } from "payload/types";
import { Product, User } from "../../payload-types";
import { stripe } from "../../lib/stripe";

// ------------------------------------------------------------
// ------------------------------------------------------------

const addUser: BeforeChangeHook<Product> = async ({ req, data }) => {
  const user = req.user;

  return { ...data, user: user.id };
};

// ------------------------------------------------------------

// const syncUser: AfterChangeHook<Product> = async ({ req, doc }) => {
//   const fullUser = await req.payload.findByID({
//     collection: "users",
//     id: req.user.id,
//   });

//   if (fullUser && typeof fullUser === "object") {
//     const { products } = fullUser;

//     const allIDs = [
//       ...(products?.map((product) =>
//         typeof product === "object" ? product.id : product
//       ) || []),
//     ];

//     const createdProductIDs = allIDs.filter(
//       (id, index) => allIDs.indexOf(id) === index
//     );

//     const dataToUpdate = [...createdProductIDs, doc.id];

//     await req.payload.update({
//       collection: "users",
//       id: fullUser.id,
//       data: {
//         products: dataToUpdate,
//       },
//     });
//   }
// };

// ------------------------------------------------------------

// const isAdminOrHasAccess =
//   (): Access =>
//   ({ req: { user: _user } }) => {
//     const user = _user as User | undefined;

//     if (!user) return false;
//     if (user.role === "admin") return true;

//     const userProductIDs = (user.products || []).reduce<Array<string>>(
//       (acc, product) => {
//         if (!product) return acc;
//         if (typeof product === "string") {
//           acc.push(product);
//         } else {
//           acc.push(product.id);
//         }

//         return acc;
//       },
//       []
//     );

//     return {
//       id: {
//         in: userProductIDs,
//       },
//     };
//   };

// ------------------------------------------------------------
// ------------------------------------------------------------

export const Products: CollectionConfig = {
  // table name in lower case
  slug: "products",

  // ------------------------------------------------------------

  admin: {
    // name field that we  are going to create for default value
    useAsTitle: "name",
  },

  // ------------------------------------------------------------

  // who can access which parts of which products, can anyone download product? no right
  access: {},

  // ------------------------------------------------------------

  // our product have a price and the strip id but we are not creating those anywhere so when we actually create that and the anwswer is when a product is created.Right away we can register it with stripe though the api and get back the stripe id assigned to this product that we can then use later on in the checkout page
  // so payload or cms provide very handy utility for that and taht is hook
  // for the hooks we get notiied we can execute our own code when a product is created for ex beforechange
  // 9:40:00
  hooks: {
    // 2 things will happen when the product is inserted into our database 1st we need to add user we have the user field but we have never actually setting it. so we will create a custom function addUser at top
    beforeChange: [
      addUser,
      async (args) => {
        // this means we are creating new product and also new product in strip as well
        if (args.operation === "create") {
          const data = args.data as Product;

          // create an product in stripe
          const createdProduct = await stripe.products.create({
            name: data.name,
            default_price_data: {
              currency: "USD",
              // this is gonna be price of the product in cents
              unit_amount: Math.round(data.price * 100),
            },
          });

          const updated: Product = {
            ...data,
            stripeId: createdProduct.id,
            priceId: createdProduct.default_price as string,
          };

          return updated;
        }
        // not gonna craete new product but we will just gonna change it for ex if user change the price we also need to change the price in stripe
        else if (args.operation === "update") {
          const data = args.data as Product;

          // this will handle the entire update case
          const updatedProduct = await stripe.products.update(data.stripeId!, {
            name: data.name,
            default_price: data.priceId!,
          });

          const updated: Product = {
            ...data,
            stripeId: updatedProduct.id,
            priceId: updatedProduct.default_price as string,
          };

          return updated;
        }
      },
    ],
  },

  // ------------------------------------------------------------

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

    // ------------------------------------------------------------

    {
      // each product will have a name
      name: "name",
      //   lable is which is visiable in admin dashboard
      label: "Name",
      type: "text",
      //   every product has to have a name
      required: true,
    },

    // ------------------------------------------------------------

    {
      name: "description",
      type: "textarea",
      label: "Product details",
    },

    // ------------------------------------------------------------

    {
      name: "price",
      label: "Price in USD",
      min: 0,
      max: 1000,
      type: "number",
      required: true,
    },

    // ------------------------------------------------------------

    {
      name: "category",
      label: "Category",
      type: "select",
      // src / config / indec.ts
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
      required: true,
    },

    // ------------------------------------------------------------

    {
      name: "product_files",
      label: "Product file(s)",
      type: "relationship",
      required: true,
      relationTo: "product_files",
      //   false => each product will have exactly one product file if you want to allow for multiple product files like for ex icon set in multiple different file formats all you have to do is change this to true
      hasMany: false,
    },

    // ------------------------------------------------------------

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

    // ------------------------------------------------------------

    {
      // where we can handle the checkout data for payments
      name: "priceId",
      access: {
        // no admin or other user can change this only owner can
        // nothing should able to change this exect us in backend we call the get payload client were we get cms.Anywhere we do this get payload client we can overwrite these access setting by "overrideAcess: true" but alredy by default we get the payload client this will override the access fields. So no user no admin will be able to chnage this except us through code "min: 5:40"
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      // hidden is true beacuse we should not see it in admin pannel
      admin: {
        hidden: true,
      },
    },

    // ------------------------------------------------------------

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

    // ------------------------------------------------------------

    {
      name: "images",
      type: "array",
      label: "Product images",
      // min image
      minRows: 1,
      // max images
      maxRows: 4,
      required: true,
      // spell in admin dashboard
      labels: {
        singular: "Image",
        plural: "Images",
      },
      // array of umages and each field is one image
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
