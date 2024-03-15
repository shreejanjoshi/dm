// this is backend

import { publicProcedure, router } from "./trpc";

// router custom api end point
// it is a server
export const appRouter = router({
  anyApiRoute: publicProcedure.query(() => {
    return "hello";
  }),
});

export type AppRouter = typeof appRouter;
