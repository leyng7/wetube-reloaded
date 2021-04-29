import express from "express";
import {deleteVideo, getEdit, getUpload, postEdit, postUpload, watch} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.get("/:id(\\d+)", watch);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);

export default videoRouter;
