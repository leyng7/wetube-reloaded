import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getEdit = (req, res) => res.render("edit-profile", {pageTitle: "Edit Profile"});

export const postEdit = async (req, res) => {
  const pageTitle = "Edit Profile";
  const {
    session: {
      user: {_id, avatarUrl}
    },
    body: {name, location},
    file
  } = req;

  try {
    req.session.user = await User.findByIdAndUpdate(
      _id,
      {
        avatarUrl: file ? file.path : avatarUrl,
        name,
        location
      },
      {
        new: true
      });
  } catch (error) {
    req.flash("error", error._message);
    return res.status(400).render("edit-profile", {pageTitle});
  }

  req.flash("success", "정보가 변경 되었습니다.");
  return res.redirect("/users/edit");
};

export const getJoin = (req, res) => res.render("join", {pageTitle: "Join"});

export const postJoin = async (req, res) => {
  const {name, email, username, password, password2, location} = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    req.flash("error", "패스워드를 확인해주세요.");
    return res.status(400).render("join", {pageTitle})
  }
  const exists = await User.exists({$or: [{username}, {email}]});
  if (exists) {
    req.flash("error", "이미 존재하는 아이디/이메일 입니다..");
    return res.status(400).render("join", {pageTitle})
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
    req.flash("error", error._message);
    return res.status(400).render("join", {pageTitle: "Upload Video"});
  }
};

export const getLogin = (req, res) => res.render('login', {pageTitle: 'Login'});

export const postLogin = async (req, res) => {
  const {username, password} = req.body;
  const pageTitle = 'Login';
  const user = await User.findOne({username, socialOnly: false});
  if (!user) {
    req.flash("error", "아이디를 확인하여 주세요.");
    return res.status(400).render("login", {pageTitle});
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    req.flash("error", "비밀번호를 확인하여 주세요.");
    return res.status(400).render("login", {pageTitle});
  }

  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

export const logout = (req, res) => {
  /*req.session.destroy();*/
  req.session.loggedIn = false;
  req.session.user = null;
  req.flash("info", "Bye Bye");
  return res.redirect("/");
};

export const see = async (req, res) => {
  console.log(id);
  const {id} = req.params;
  try {
    const user = await User.findById(id).populate({
      path: "videos",
      populate: {
        path: "owner",
        model: "User"
      }
    });
    if (!user) {
      return res.status(404).render("404", {pageTitle: "User not found."});
    }

    return res.render("users/profile", {
      pageTitle: user.name,
      user,
    })
  } catch (error) {
    return res.status(404).render("404", {pageTitle: "User not found."});
  }

};

export const startGithubLogin = (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/authorize';
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: 'read:user user:email'
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ('access_token' in tokenRequest) {
    const {access_token} = tokenRequest;
    const apiUrl = 'https://api.github.com';
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        }
      })
    ).json();

    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        }
      })
    ).json();

    const emailObj = emailData.find(email => email.primary === true && email.verified === true);
    if (!emailObj) return res.redirect("/login");

    let user = await User.findOne({email: emailObj.email});
    if (!user) {
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }

    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly) {
    req.flash("error", "Can't change password.")
    return res.redirect("/");
  }
  return res.render("users/change-password", {pageTitle: 'Change Password'});
}

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: {_id}
    },
    body: {oldPassword, newPassword, newPasswordConfirmation}
  } = req;

  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match the confirmation",
    });
  }

  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect",
    });
  }

  user.password = newPassword;
  await user.save();
  req.flash("info", "Password updated");
  return res.redirect("/users/logout");
}
