import express from "express";
import {edit, finishGithubLogin, logout, remove, see, startGithubLogin} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/logout", logout);
userRouter.get("/remove", remove);
userRouter.get("/:id", see);

userRouter.get("/github/start", startGithubLogin)
userRouter.get("/github/finish", finishGithubLogin)

export default userRouter;
