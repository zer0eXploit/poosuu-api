import "colors";
import morgan from "morgan";
import express from "express";

import "./config/env.js";
import connectDB from "./config/db.js";
import connectRedis from "./config/redis.js";

import v1Routes from "./routes/v1/index.js";

import { errorHandler, notFoundHandler } from "./helpers/error-handlers.js";

const app = express();

// Disable X-Powered-By: Express
app.disable("x-powered-by");

// DB connection
connectDB();
connectRedis();

// Middlewares
app.use(express.json());

if (process.env.NODE_ENV !== "production") app.use(morgan("tiny"));

// Mount Routes
app.get("/", (_req, res) => res.json({ message: "Hello 世界!" }));

app.use("/v1/", v1Routes);

// Error Handlers
app.use(errorHandler);
app.use(notFoundHandler);

const PORT = process.env?.PORT || "5000";

app.listen(PORT, () => {
  const env = process.env.NODE_ENV;
  console.log(`Server running in ${env} mode on port ${PORT}!`.black.bgCyan);
});
