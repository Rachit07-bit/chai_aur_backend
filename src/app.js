import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Create the Express application.
// Think of this as creating the backend server on which we will
// register middleware and routes.
const app = express();

// ================= MIDDLEWARES =================

// Frontend and backend usually run on different ports during development.
// Example:
// Frontend -> localhost:5173
// Backend  -> localhost:8000
//
// Browsers block such requests by default because of CORS policy.
// This middleware tells the browser:
// "It is okay if requests come from this frontend."
//
// credentials: true allows cookies, authorization headers, etc.
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Whenever a client sends JSON data:
//
// {
//   "username": "harsh",
//   "email": "abc@gmail.com"
// }
//
// Express cannot understand it automatically.
// This middleware converts JSON into a JavaScript object
// and stores it in req.body.
//
// limit is added so users cannot send extremely large payloads.
app.use(express.json({ limit: "16kb" }));

// Handles form data sent from HTML forms.
//
// Without this middleware,
// req.body would be undefined for form submissions.
//
// extended: true allows nested objects.
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

// Makes files inside the public folder accessible directly.
//
// Example:
// public/avatar.png
//
// can be accessed as:
// http://localhost:8000/avatar.png
//
// Useful for images, PDFs, uploads, etc.
app.use(express.static("public"));

// Reads cookies sent by the browser.
//
// Without this middleware:
// req.cookies -> undefined
//
// With this middleware:
// req.cookies.accessToken
// req.cookies.refreshToken
//
// become available.
app.use(cookieParser());

// ================= IMPORT ROUTES =================

// Instead of writing all routes inside one file,
// we split them feature-wise.
//
// This keeps the code clean and scalable.
//
// user.routes.js -> user related APIs
// video.routes.js -> video related APIs
// comment.routes.js -> comment related APIs

import userRouter from "./routes/user.routes.js";
// import healthcheckRouter from "./routes/healthcheck.routes.js";
// import tweetRouter from "./routes/tweet.routes.js";
// import subscriptionRouter from "./routes/subscription.routes.js";
// import videoRouter from "./routes/video.routes.js";
// import commentRouter from "./routes/comment.routes.js";
// import likeRouter from "./routes/like.routes.js";
// import playlistRouter from "./routes/playlist.routes.js";
// import dashboardRouter from "./routes/dashboard.routes.js";

// ================= ROUTE REGISTRATION =================

// app.use(basePath, router)
//
// Meaning:
// If a request starts with basePath,
// hand over the remaining work to this router.

// Used to check whether server is alive or not.
// Commonly used by monitoring systems.
// app.use("/api/v1/healthcheck", healthcheckRouter);

// All user-related APIs come here.
//
// Example:
//
// router.post("/register")
//
// becomes
//
// /api/v1/users/register
//
// router.post("/login")
//
// becomes
//
// /api/v1/users/login
app.use("/api/v1/users", userRouter);

// All tweet-related APIs
//
// Example:
// /api/v1/tweets/create
// /api/v1/tweets/delete
// app.use("/api/v1/tweets", tweetRouter);

// All subscription-related APIs
// app.use("/api/v1/subscriptions", subscriptionRouter);

// All video-related APIs
// app.use("/api/v1/videos", videoRouter);

// All comment-related APIs
// app.use("/api/v1/comments", commentRouter);

// All like-related APIs
// app.use("/api/v1/likes", likeRouter);

// All playlist-related APIs
// app.use("/api/v1/playlist", playlistRouter);

// All dashboard-related APIs
// app.use("/api/v1/dashboard", dashboardRouter);

// Example flow:
//
// Browser sends request:
//
// POST /api/v1/users/register
//
// app.js receives request
//      ↓
// Matches "/api/v1/users"
//      ↓
// Forwards request to userRouter
//      ↓
// userRouter finds "/register"
//      ↓
// Controller executes
//      ↓
// Response returned to client

export { app };

