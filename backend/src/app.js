import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

// Middleware
//app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cors({
    origin: 'https://mern-lms-frontend.onrender.com', // Your frontend URL exactly
    credentials: true,               // Allow credentials (cookies)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test Route
// app.get("/", (req, res) => {
//   res.send("Welcome to Teach API!");
// });

import router from "./routes/auth.route.js";
app.use("/api/auth", router);

import courserouter from "./routes/course.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
app.use("/api/course", courserouter);

app.use(errorMiddleware);
export { app };
