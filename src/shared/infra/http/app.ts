import "reflect-metadata";
import "dotenv/config";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";

import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

import "@shared/container";

import upload from "@config/upload";
import { AppError } from "@shared/errors/AppError";
import rateLimiter from "@shared/infra/http/middlewares/rateLimiter";

import swaggerFile from "../../../swagger.json";
import createConnection from "../typeorm";
import { router } from "./routes";

createConnection();
const app = express();

app.use(rateLimiter);

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/avatar", express.static(`${upload.tmpFolder}/avatar`));
app.use("/cars", express.static(`${upload.tmpFolder}/cars`));

app.use(cors());
app.use(router);

app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture all 429 and 500 errors
      if (error.status === 429 || error.status === 500) {
        return true;
      }
      return false;
    },
  })
);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    });
  }
);

app.get("/", (request, response) => {
  return response.json({ message: "Hello world!" });
});

export { app };
