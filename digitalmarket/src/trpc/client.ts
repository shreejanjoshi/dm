import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "./";

// <> genric contain entrity of backendµ
// front end know the type of backend
export const trpc = createTRPCReact<AppRouter>({});
