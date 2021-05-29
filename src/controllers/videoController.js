import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
import moment from "moment";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({createdAt: "desc"})
    .populate("owner");
  return res.render("home", {pageTitle: "Home", videos})
};

export const watch = async (req, res) => {
  const {id} = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");

  if (!video) {
    return res.status(404).render("404", {pageTitle: "Video not found."});
  }

  video.meta.views = video.meta.views + 1;
  await video.save();

  return res.render("watch", {
    pageTitle: video.title,
    video,
    createAt: moment(video.createdAt).format('YYYY. M. D')
  });
};

export const getEdit = async (req, res) => {
  const {id} = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", {pageTitle: "Video not found."});
  }

  const {user} = req.session;
  if (String(video.owner) !== String(user._id)) {
    return res.status(403).redirect("/");
  }

  return res.render("edit", {pageTitle: `Edit: ${video.title}`, video});
};

export const postEdit = async (req, res) => {
  const {id} = req.params;
  const {title, description, hashtags} = req.body;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", {pageTitle: "Video not found."});
  }

  const {user} = req.session;
  if (String(video.owner) !== String(user._id)) {
    req.flash("error", "수정할 권한이 없습니다.");
    return res.status(403).redirect("/");
  }

  try {
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags)
    });

    req.flash("success", "수정 하였습니다.");

    return res.redirect(`/videos/${id}`);
  } catch (error) {
    return res.redirect(`/videos/${id}/edit`);
  }
};

export const getUpload = (req, res) => {
  return res.render("upload", {pageTitle: "Upload Video"});
};

export const postUpload = async (req, res) => {
  const {
    user: {_id}
  } = req.session;
  const {video, thumb} = req.files;
  const {title, description, hashtags} = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags)
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    req.flash("error", error._message);
    return res.render("upload", {
      pageTitle: "Upload Video"
    });
  }
};

export const deleteVideo = async (req, res) => {
  const {id} = req.params;

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", {pageTitle: "Video not found."});
  }

  const {user} = req.session;
  if (String(video.owner) !== String(user._id)) {
    req.flash("error", "권한이 없습니다.");
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const {keyword} = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i")
      }
    }).populate("owner");
  }
  return res.render("search",
    {
      pageTitle: "Search",
      videos,
      keyword
    }
  );
};

export const registerView = async (req, res) => {
  const {id} = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
}

export const createComment = async (req, res) => {
  const {
    session: {user},
    body: {text},
    params: {id},
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};
