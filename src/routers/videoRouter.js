import express from "express";
import {deleteVideo, getEdit, postEdit, see, upload} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);

export default videoRouter;
