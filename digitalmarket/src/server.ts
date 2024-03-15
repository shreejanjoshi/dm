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

const app = express();
// production is env because the server will give us the port and in development it is 3000
const PORT = Number(process.env.PORT) || 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

const start = async () => {
  // admin data
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

  // middelware -> when we get req in server we foward it to trcp in nextjs
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      // it allows us to take something from express like req en rep that we get from rxpress and then attach them to something called the context to be able to use them also in nextjs
      createContext,
    })
  );

  // to host send it to next-util.ts
  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    // payload.logger.info("Next.js started");

    app.listen(PORT, async () => {
      //   payload.logger.info(
      //     `Next.js APP URL : ${process.env.NEXT_PUBLIC_SERVER_URL}`
      //   );
    });
  });
};

start();

// now can just import this getpayloadclient everywhere where we need database access for example in our server file
