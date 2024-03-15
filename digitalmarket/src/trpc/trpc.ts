// give us the router and can define api end point

import { initTRPC } from "@trpc/server";

const t = initTRPC.context().create();

export const router = t.router;
// any one call this api end point it is public
export const publicProcedure = t.procedure;
