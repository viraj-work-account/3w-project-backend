import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// limit so that server wont crash
app.use(
  express.json({
    limit: "40kb",
  })
);

// url data
app.use(
  express.urlencoded({
    extended: true,
    limit: "40kb",
  })
);

// public assets -> imgs to be stored in my server
app.use(express.static("public"));

// cookies
app.use(cookieParser());

export { app };
