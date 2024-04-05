// this is backend

import { authRouter } from "./auth-router";
import { publicProcedure, router } from "./trpc";

// router custom api end point
// it is a server
export const appRouter = router({
  // auth router: dont need to put all thing api logic in this file
  // anyApiRoute: publicProcedure.query(() => {
  //   return "hello";
  // }),
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
