import express from "express";
import compression from "compression";
import { PORT } from "./config/index.js";
import http from "http";
import movieRouter from "./routers/movieRouter.js";
import reviewRouter from "./routers/reviewRouter.js";
import cors from "cors";

export const app = express();

app.use(compression({ level: 6 }));

const restrictedCorsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], //currently no authentication and role based authorization
  credentials: true,
  maxAge: 86400,
};
app.use(cors(restrictedCorsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", movieRouter);
app.use("/api/v1", reviewRouter);

let server: http.Server | undefined;

async function startServer() {
  try {
    server = app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

async function gracefulShutdown() {
  console.log("Graceful shutdown initiated");

  if (server) {
    server.close(async (err) => {
      if (err) {
        console.error("Error closing HTTP server:", err);
        process.exit(1);
      }
      console.log("HTTP server closed");
      process.exit(0);
    });
  }
}

const signals = ["SIGINT", "SIGTERM", "SIGQUIT"];
signals.forEach((signal) => {
  process.on(signal, () => {
    console.log(`Received ${signal}, starting graceful shutdown...`);
    gracefulShutdown();
  });
});

startServer();
