import update from "payload/dist/collections/operations/update";
import { User } from "../payload-types";
import { Access, CollectionConfig } from "payload/types";

// ------------------------------------------------------------
// ------------------------------------------------------------

// we are gonna return access policy that determines can you raed this image or not
// in this function we are returing another functions
const isAdminOrHasAccessToImges =
  (): Access =>
  async ({ req }) => {
    const user = req.user as User | undefined;

    // u cant read img
    if (!user) return false;
    // u can read image
    if (user.role === "admin") return true;

    // query constraint if this user owns this images if the user property of the image sthat we are accessing which is nothing else than this user field (media fields) that we are setting right here. When we create an image so if the image sfiels equals the currently logged in user then essentially its your images. So we aresaying only allow access to your images if you are looged in beacsue otherwise you should not be albe to see this at all
    // in short you can see your own images
    return {
      user: {
        equals: req.user.id,
      },
    };
  };

// ------------------------------------------------------------
// ------------------------------------------------------------

export const Media: CollectionConfig = {
  slug: "media",

  // ------------------------------------------------------------

  hooks: {
    // invoke custom functions that we want to run
    // cms functions also provides us data we can use to execute yhese functions
    beforeChange: [
      ({ req, data }) => {
        // product image here should also be associated with directly to the user. The reason is when the user is in the back end and choosing from their existinbg media files we dont any one to be able to access all the media fiels from other people. Ex - you as the logged in user should only be the ones that you owns

        return { ...data, user: req.user.id };
      },
    ],
  },

  // ------------------------------------------------------------

  //   i dont to see your image and you dont wanna see my image in seller dashboard
  access: {
    read: async ({ req }) => {
      const referer = req.headers.referer;

      // we are checking if the user is not logged in  they can read all images
      // sell -> if u in frontend u can see all the images and if you are in backend in u cant see all images
      if (!req.user || !referer?.includes("sell")) {
        return true;
      }

      return await isAdminOrHasAccessToImges()({ req });
    },
    // is same
    // delete: ({req}) => isAdminOrHasAccessToImges()({req})
    delete: isAdminOrHasAccessToImges(),
    update: isAdminOrHasAccessToImges(),
  },

  // ------------------------------------------------------------

  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },

  // ------------------------------------------------------------

  //   min: 5:56
  upload: {
    staticURL: "/media",
    staticDir: "media",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        // calculate itself
        height: undefined,
        position: "center",
      },
    ],
    // only takes image jpg, imge png, svg but nothing else then images
    mimeTypes: ["image/*"],
  },

  // ------------------------------------------------------------

  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      //   not gonna show this in admin pannel
      admin: {
        condition: () => false,
      },
    },
  ],
};
