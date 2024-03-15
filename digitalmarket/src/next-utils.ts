// 3.

import next from "next";

// define some utilies for next js

const PORT = Number(process.env.PORT) || 3000;

export const nextApp = next({
  dev: process.env.NODE_ENV !== "production",
  port: PORT,
});

// to self host next app
export const nextHandler = nextApp.getRequestHandler();
