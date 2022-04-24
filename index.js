import "colors";
import path from "path";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";

import "./config/env.js";
import connectDB from "./config/db.js";
import connectRedis from "./config/redis.js";

import v1Routes from "./routes/v1/index.js";

import { errorHandler, notFoundHandler } from "./helpers/error-handlers.js";

const app = express();

// Enable Cors
app.use(cors());

// Static Folder
app.use("/static", express.static(path.join(process.cwd(), "public")));

// File Upload
app.use(
  fileUpload({
    limits: {
      fileSize: parseInt(process.env.FILE_UPLOAD_LIMIT_NUM_MB) * 1024 * 1024,
    },
  })
);

// Disable X-Powered-By: Express
app.disable("x-powered-by");

// DB connection
connectDB();
connectRedis();

// Middlewares
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  const { default: morgan } = await import("morgan");
  app.use(morgan("tiny"));
}

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
