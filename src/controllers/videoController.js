import Video from "../models/Video";


export const deleteVideo = (req, res) => {
    res.send("Delete Video")
};

export const home = async (req, res) => {
    const videos = await Video.find({});
    return res.render("home", {pageTitle: "Home", videos})
};

export const watch = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);

    if (!video) {
        return res.render("404", {pageTitle: "Video not found."});
    }
    return res.render("watch", {pageTitle: video.title, video});
};

export const getEdit = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.render("404", {pageTitle: "Video not found."});
    }
    return res.render("edit", {pageTitle: `Edit: ${video.title}`, video});
};

export const postEdit = async (req, res) => {
    const {id} = req.params;
    const {title, description, hashtags} = req.body;
    const existsVideo = await Video.exists({_id: id});
    if (!existsVideo) {
        return res.render("404", {pageTitle: "Video not found."});
    }

    try {
        await Video.findByIdAndUpdate(id, {
            title,
            description,
            hashtags: hashtags
                .split(",")
                .map(word => word.startsWith("#") ? word : "#" + word)
        });

        return res.redirect(`/videos/${id}`);
    } catch (error) {
        return res.redirect(`/videos/${id}/edit`);
    }
};

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
};

export const postUpload = async (req, res) => {
    const {title, description, hashtags} = req.body;
    try {
        await Video.create({
            title,
            description,
            hashtags: hashtags
                .split(",")
                .map(word => word.startsWith("#") ? word : "#" + word)
        });
        return res.redirect("/");
    } catch (error) {
        return res.render("upload", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }
};

export const search = (req, res) => res.send("Search Video");

