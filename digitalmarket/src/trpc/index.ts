// this is backend

import { object, z } from "zod";
import { authRouter } from "./auth-router";
import { publicProcedure, router } from "./trpc";
import { QueryValidator } from "../lib/validators/query-validator";
// .. is relative imports
import { getPayloadClient } from "../get-payload";
// import { paymentRouter } from "./payment-router";

// ------------------------------------------------------------
// ------------------------------------------------------------

// router custom api end point
// it is a server
export const appRouter = router({
  // auth router: dont need to put all thing api logic in this file
  // anyApiRoute: publicProcedure.query(() => {
  //   return "hello";
  // }),
  auth: authRouter,
  payment: paymentRouter,

  // get products
  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        // how many product we can fetch min and max product user can fetch
        limit: z.number().min(1).max(100),
        // last element that was render so is if the user is scrolling to get more products then the cursor will be where we will begin fetching the next page of products for the infinite query
        cursor: z.number().nullish(),
        // custom validator so only certain options that we allow can even be passed in here
        query: QueryValidator,
      })
    )
    // bussiness logic and querying the data
    .query(async ({ input }) => {
      const { query, cursor } = input;
      // ...queryOpts -> geting all the other property and calling them query options as an object. we use this for very easily extenedable
      // min 6:55
      const { sort, limit, ...queryOpts } = query;

      // get product from our database
      const payload = await getPayloadClient();

      const parsedQueryOpts: Record<string, { equals: string }> = {};

      Object.entries(queryOpts).forEach(([key, value]) => {
        parsedQueryOpts[key] = {
          // we are taking raw input and turing it into something that or cms understand in the query. So we are putting it into a proper syntax for our cms that is all we are doing where the equals is the value
          equals: value,
        };
      });

      // page will be either the ci-ursor that we pass in or one as the default becaus ewe want to start fetching at the first item in our database
      const page = cursor || 1;

      const {
        docs: items,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: "products",
        where: {
          approvedForSale: {
            equals: "approved",
          },
          ...parsedQueryOpts,
        },
        sort,
        // fetch level deep
        depth: 1,
        limit,
        page,
      });

      return {
        items,
        nextPage: hasNextPage ? nextPage : null,
      };
    }),
});

// ------------------------------------------------------------
// ------------------------------------------------------------

export type AppRouter = typeof appRouter;
