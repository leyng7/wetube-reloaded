export const deleteVideo = (req, res) => {
    console.log(req.params.id);
    res.send("Delete Video")
};

export const edit = (req, res) => res.send("Edit Video");

export const search = (req, res) => res.send("Search Video");

export const see = (req, res) => res.send("See Video");

export const trending = (req, res) => res.render("home");

export const upload = (req, res) => res.send("Upload Video");

