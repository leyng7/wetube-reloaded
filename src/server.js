import express from "express";
import morgan from "morgan";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";
import globalRouter from "./routers/globalRouter";



const PORT = 4000;

const app = express();
const logger = morgan("dev")

const handleListening = () => console.log(`Server listening on port http://localhost:${PORT} 🚀`);

app.set('view engine', 'pug');
app.set("views", process.cwd() + "/src/views");

app.use(logger);
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

app.listen(PORT, handleListening);
