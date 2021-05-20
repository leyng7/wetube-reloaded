import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import rootRouter from "./routers/rootRouter";
import {localsMiddleware} from "./middlewares";

const app = express();
const logger = morgan("dev")

app.set('view engine', 'pug');
app.set("views", process.cwd() + "/src/views");

app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: "Hello!",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: "mongodb://192.168.0.15:27017/wetube" })
    })
)

app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
