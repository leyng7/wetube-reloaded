import express from "express";
import {getEdit, finishGithubLogin, logout, see, startGithubLogin, postEdit} from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/edit").get(getEdit).post(postEdit);
userRouter.get("/logout", logout);
userRouter.get("/:id", see);

userRouter.get("/github/start", startGithubLogin)
userRouter.get("/github/finish", finishGithubLogin)

export default userRouter;
