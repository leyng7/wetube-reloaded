let videos = [
    {
        id: 1,
        title: "First Video",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 59,
    },
    {
        id: 2,
        title: "Second Video",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 59,
    },
    {
        id: 3,
        title: "Third Video",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes ago",
        views: 59,
    },
];

export const deleteVideo = (req, res) => {
    res.send("Delete Video")
};

export const getEdit = (req, res) => {
    const {id} = req.params;
    const video = videos[id - 1];
    return res.render("edit", {pageTitle: `Editing: ${video.title}`, video});
};

export const postEdit = (req, res) => {
    const {id} = req.params;
    const {title} = req.body;
    videos[id - 1].title = title;

    return res.redirect(`/videos/${id}`);
};

export const search = (req, res) => res.send("Search Video");

export const see = (req, res) => {
    const {id} = req.params;
    const video = videos[id - 1];
    return res.render("watch", {pageTitle: `Watching ${video.title}`, video});
};

export const trending = (req, res) => {
    return res.render("home", {pageTitle: "Home", videos})
};

export const upload = (req, res) => res.send("Upload Video");

