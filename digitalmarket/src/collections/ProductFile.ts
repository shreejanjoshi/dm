import { User } from "../payload-types";
import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { Access, CollectionConfig } from "payload/types";

// ------------------------------------------------------------
// ------------------------------------------------------------

const addUser: BeforeChangeHook = ({ req, data }) => {
  // min 6:17
  const user = req.user as User | null;

  return { ...data, user: user?.id };
};

// ------------------------------------------------------------

const yourOwnAndPurchased: Access = async ({ req }) => {
  // who is making request
  const user = req.user as User | null;

  // if admin you can read everything
  if (user?.role === "admin") return true;
  // if no user
  if (!user) return false;

  // ------------------------------------------------------------

  // when is the user allowed to read the file. 1st if you own the file so we need to get all the ids of the products that this current logged in users owns.
  const { docs: products } = await req.payload.find({
    collection: "products",
    // when we serach for product each product is attached to user by an id and if we had depth of one it would actually fetach the entire user that is attached to this product but we we only care about the id its kind of like join in sql but we only care about id so we are only going to have depth of zero and we can get access to the results by saying the docs or by destructing the docs and calling them for example products because that what they are after all we rae searching in the product collections
    // min 6:22
    depth: 0,
    // where the user that owns these products equal this user.id
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  // ------------------------------------------------------------

  // this is string or product file array so what we can do is simply call .flat just incase it also fetches the actual product files so we can make sure y-that this is an array of the ids for each product files
  const ownProductFileIds = products.map((prod) => prod.product_files).flat();

  // bought
  const { docs: orders } = await req.payload.find({
    collection: "orders",
    // joins some table together give us order and users and there products
    depth: 2,
    where: {
      user: {
        equals: user.id,
      },
    },
  });

  // ------------------------------------------------------------

  const purchasedProductFileIds = orders
    .map((order) => {
      return order.products.map((product) => {
        if (typeof product === "string")
          return req.payload.logger.error(
            "Serach depth not sufficient to find purchased file IDs"
          );

        // if not string it is entire products
        return typeof product.product_files === "string"
          ? product.product_files
          : product.product_files.id;
      });
      // takes out all the undefined values out of the array and secondly a flat which is going to turn this into a flat array so we dont have a weird array array that we cant really work with
    })
    .filter(Boolean)
    .flat();

  // ------------------------------------------------------------

  return {
    // return a query constraint where the id of the product files that we are requesting needs to be in array so we can say in pass it in array and now we want to spread in both the file ids that we own so the ...ownProductFileIds and then also the ...purchasedProductFileIds essentially constructing an array that contains both or own and the ones that we bought and we are just checking is the file that you are requesting in either of these two arrays and if it is then yes you are able to access it
    id: {
      in: [...ownProductFileIds, ...purchasedProductFileIds],
    },
  };
};

// ------------------------------------------------------------
// ------------------------------------------------------------

export const ProductFiles: CollectionConfig = {
  slug: "product_files",

  // ------------------------------------------------------------

  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },

  // ------------------------------------------------------------
  hooks: {
    beforeChange: [addUser],
  },

  // ------------------------------------------------------------

  access: {
    read: yourOwnAndPurchased,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },

  // ------------------------------------------------------------

  upload: {
    // we can find this file under localhost../product_files
    staticURL: "/product_files",
    // this directry will be alivable under this url
    staticDir: "product_files",
    mimeTypes: ["image/*", "font/*", "application/postscript"],
  },

  // ------------------------------------------------------------

  // we have user relations but we are not setting the user anywhere when this is created that why we have to craete hook

  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: {
        condition: () => false,
      },
      hasMany: false,
      required: true,
    },
  ],
};
