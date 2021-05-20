import User from "../models/User";
import bcrypt from "bcrypt";

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

    try {
        await User.create({
            name,
            email,
            username,
            password,
            location
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("join", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }
};

export const getLogin = (req, res) => res.render('login', {pageTitle: 'Login'});

export const postLogin = async (req, res) => {
    const {username, password} = req.body;
    const pageTitle = 'Login';
    const user = await User.findOne({username});
    if (!user) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "An account with this username does not exists.",
        });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "Wrong password",
        });
    }

    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/");
};

export const logout = (req, res) => res.send("Logout");

export const remove = (req, res) => res.send("Remove User");

export const see = (req, res) => res.send("See User Profile");

export const startGithubLogin = (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/authorize';
    const config = {
        client_id: 'da34447c7b587c689fce',
        allow_signup: false,
        scope: 'read:user user:email'
    };
    const params = new URLSearchParams(config).toString();

    return res.redirect(`${baseUrl}?${params}`);
};

export const finishGithubLogin = (req, res) => res.end();
