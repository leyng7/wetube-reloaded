import User from "../models/User";

export const edit = (req, res) => res.send("Edit User");

export const getJoin = (req, res) => res.render("join", {pageTitle: "Join"});

export const postJoin = async (req, res) => {
    const {name, email, username, password, password2, location} = req.body;
    const pageTitle = "Join";
    if (password !== password2) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match."
        })
    }
    const exists = await User.exists({$or: [{username}, {email}]});
    if (exists) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "This username/email is already taken.",
        })
    }

    await User.create({
        name,
        email,
        username,
        password,
        location
    });
    return res.redirect("/login");
};

export const login = (req, res) => res.send("Login");

export const logout = (req, res) => res.send("Logout");

export const remove = (req, res) => res.send("Remove User");

export const see = (req, res) => res.send("See User Profile");
