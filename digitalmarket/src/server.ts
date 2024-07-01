// 1.
// selfthost this entire things

// install npm add express
// install npm add -D @types/express
// install npm add cross-env : look in package.json change there also

import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";
import bodyParser from "body-parser";
import { IncomingMessage } from "http";
import { stripeWebhookHandler } from "./webhooks";
import nextBuild from "next/dist/build";
import path from "path";
import { PayloadRequest } from "payload/types";
import { parse } from "url";

// ------------------------------------------------------------
// ------------------------------------------------------------

const app = express();
// production is env because the server will give us the port and in development it is 3000
const PORT = Number(process.env.PORT) || 3000;

// ------------------------------------------------------------

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

// ------------------------------------------------------------

// typescript not recornazing req, res that come from cretecontext to authrouter.ts . so we use this
// we can use this ExpressContext in trpc initialization for under src -> trpc -> trpc.ts
export type ExpressContext = inferAsyncReturnType<typeof createContext>;

// ------------------------------------------------------------

// we gonna slighty modify this req in order for us to make it readable and check if the msg actually comes from stripe beacus it will have certain signature that we need to validate on or end to make sure it is actually stripe and not just anyone i an trying to call or webhook
// 10:40:00
export type WebhookRequest = IncomingMessage & {
  rawBody: Buffer;
};

// ------------------------------------------------------------

const start = async () => {
  // we need to know when we recevied the money

  // bodyparser is a seperate package we can install that goes very well with teh express and taht will allow us to receive the proper notific from the stripe
  // the reason we are doing this is to modified the msg that stripe send us
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer;
    },
  });

  // ------------------------------------------------------------

  // no whenever somebody make post req to our app app.post to /api then we gonna use webhookmiddleware
  app.post("/api/webhooks/stripe", webhookMiddleware, stripeWebhookHandler);

  // ------------------------------------------------------------

  // admin data
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

  // ------------------------------------------------------------

  // add build script in the server to build this production if the process .env
  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info("Next.js is building for production");

      // @ts-expect-error
      await nextBuild(path.join(__dirname, "../"));

      process.exit();
    });

    return;
  }

  // ------------------------------------------------------------

  // middelware -> when we get req in server we foward it to trcp in nextjs
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      // it allows us to take something from express like req en rep that we get from rxpress and then attach them to something called the context to be able to use them also in nextjs
      // transfer data from express to nextjs and trpc
      createContext,
    })
  );

  // ------------------------------------------------------------

  // to host send it to next-util.ts
  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info("Next.js started");

    app.listen(PORT, async () => {
      payload.logger.info(
        `Next.js APP URL : ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

// ------------------------------------------------------------

start();

// now can just import this getpayloadclient everywhere where we need database access for example in our server file
