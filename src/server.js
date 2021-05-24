import express from "express";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import rootRouter from "./routers/rootRouter";
import apiRouter from "./routers/apiRouter";
import {localsMiddleware} from "./middlewares";

const app = express();
const logger = morgan("dev")

app.set('view engine', 'pug');
app.set("views", process.cwd() + "/src/views");

app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.DB_URL })
    })
)

app.use(flash());
app.use(localsMiddleware);
app.use("/static", express.static("assets"))
app.use("/uploads", express.static("uploads"))
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
