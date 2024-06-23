// give us the router and can define api end point

import { ExpressContext } from "@/server";
import { TRPCError, initTRPC } from "@trpc/server";
import { User } from "payload/dist/auth";
import { PayloadRequest } from "payload/types";

// ExpressContext comes from server.ts
const t = initTRPC.context<ExpressContext>().create();
const middleware = t.middleware;

// payment ones
const isAuth = middleware(async ({ ctx, next }) => {
  // this is regular  req in express and cms automatically attaches the user to that request. so we know this will be type of payload request beacuse the user will be in there its not a completey regular request but you know very similar to it just with a user attached to it so we can desctrusture user from the request
  const req = ctx.req as PayloadRequest;

  //   if the user is type null then we know user is not logged in
  const { user } = req as { user: User | null };

  //   if no user then middelware should not proceed
  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  //   if they are logged in
  // min 9:22:00
  return next({
    ctx: {
      user,
    },
  });
});

export const router = t.router;
// any one call this api end point it is public
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
