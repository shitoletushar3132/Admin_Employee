const db = require("../middleware.js");

// Login Index Route
module.exports.login = (req, res) => {
  res.render("login.ejs");
};

//   Login post Route
module.exports.loginPost = (req, res) => {
  let { username, password } = req.body;

  db.checkUserExists(username, (err, userExists) => {
    if (err) {
      console.error("Error checking user existence:", err);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (!userExists) {
      res.render("login.ejs", { error: "Username Not Found" });
      return;
    }

    db.verifyPassword(username, password, (err, passwordMatches) => {
      if (err) {
        console.error("Error verifying password:", err);
        res.status(500).send("Internal Server Error");
        return;
      }
      if (!passwordMatches) {
        res.render("login.ejs", { error: "Incorrect password" });
        return;
      }

      req.session.username = username;
      res.redirect("/admin/dashboard");
    });
  });
};
