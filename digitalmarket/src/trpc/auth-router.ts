// this like sepreate api end point that handle all the auth logic
import { AuthCredentialsValidator } from "../lib/validators/account-credentials-validator";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../get-payload";
import { TRPCError } from "@trpc/server";
import { sign, verify } from "crypto";
import VerifyEmail from "@/components/VerifyEmail";
import { z } from "zod";

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

  // valitade user email
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    // no need to use mutation becase wez are not changing data but we are reading data
    .query(async ({ input }) => {
      const { token } = input;

      // that we wrote that get us access to our CMS
      const payload = await getPayloadClient();

      const isVerified = await payload.verifyEmail({
        collection: "users",
        token,
      });

      if (!isVerified) throw new TRPCError({ code: "UNAUTHORIZED" });

      return { success: true };
    }),

  signIn: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const { res } = ctx;

      // playload is cms first need to have access to it
      const payload = await getPayloadClient();

      try {
        await payload.login({
          collection: "users",
          data: {
            email,
            password,
          },
          // All a login is an exchange from your email and password you send it to server. Email and password req to server and server gives back token. This token is nothing else than the equivalent of your email and password stored as cookie. so we use req that coms from express
          res,
        });

        return { success: true };
      } catch (err) {
        // IF WRONG EMAIL OR PASSWORD UNAUTH
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }),
});
