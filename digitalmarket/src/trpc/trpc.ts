// give us the router and can define api end point

import { ExpressContext } from "@/server";
import { initTRPC } from "@trpc/server";

// ExpressContext comes from server.ts
const t = initTRPC.context<ExpressContext>().create();

export const router = t.router;
// any one call this api end point it is public
export const publicProcedure = t.procedure;
