import express from "express";
import morgan from "morgan";
import { Environment, HttpStatusCode } from "./utils/constant";
import cors from "cors";
import { corsOptions } from "./config/cors";
import { errorHandler } from "./middlewares/error.middleware";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { xssSanitizer } from "./middlewares/xss.middleware";
import mongoSanitize from "express-mongo-sanitize";
import routes from "./routes/index.route";
import passport from "./config/passport";

const app = express();

app.use(helmet());
app.use(
  morgan(process.env.NODE_ENV === Environment.DEVELOPMENT ? "dev" : "combined")
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(xssSanitizer);
// app.use(mongoSanitize());
app.use(
  mongoSanitize({
    replaceWith: "_",
    onSanitize: (key: any) => {
      console.log(`Clé nettoyée : ${key}`);
    },
  })
);
app.use(cors(corsOptions));
app.use(passport.initialize());

app.post("/test/:name", (req, res, next) => {
  console.log("Body :", req.body);
  console.log("Params :", req.params);
  console.log("Query :", req.query);
  res.status(200).json({ message: "ok" });
});

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to MERN-AUTH api.");
});

// All routes
app.use('/api', routes)

// Not found routes
app.get(/(.*)/, (req, res) => {
  res
    .status(HttpStatusCode.NOT_FOUND)
    .send(`Can't find ${req.originalUrl} on this server.`);
});

app.use(errorHandler);

export default app;
