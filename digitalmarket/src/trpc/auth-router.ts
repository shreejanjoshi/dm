// this like sepreate api end point that handle all the auth logic
import { AuthCredentialsValidator } from "../lib/validators/account-credentials-validator";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../get-payload";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  //create user in cms and pp is anyone can call this api endpoint and they dont need to be logged in to do so. This is sign in and sign up so public can be no problem but we will also create private
  //acv give email and password frontend to backend. This is backend
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      //need acess to cms to create user
      const payload = await getPayloadClient();

      //   check if user already exists
      // giving docs a custom name
      const { docs: users } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });

      //   BECASUE if users fond some name which should not
      if (users.length !== 0)
        throw new TRPCError({
          code: "CONFLICT",
        });

      // if not found same name create
      await payload.create({
        collection: "users",
        data: {
          email,
          password,
          role: "user",
        },
      });

      return { success: true, sentToEmail: email };
    }),
});
