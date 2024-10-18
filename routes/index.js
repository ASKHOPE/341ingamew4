const express = require('express');
const router = express.Router();
const passport = require("passport");
const { userValidation, validationResult } = require('../middleware/validator');

// Load sub-routes
router.use('/user', require('./user'));
router.use('/clients', require('./clients'));
router.use("/", require("./swagger"));  // Assuming this serves the Swagger API documentation

// // Home route (GitHub OAuth example)
// router.get("/", (req, res) => {
//   res.send("Welcome to the GitHub OAuth example!");
// });
// app.get('/',(req,res)=> {res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.username}` : "Logged Out")});

router.get('/',(req,res)=> {res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.username}` : "Logged Out")});

// GitHub authentication route
router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));//,session:false reauthentication

// GitHub callback route
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),//,session:false reauthentication
  (req, res) => {
    // Successful authentication
    req.session.user = req.user;
    res.redirect("/profile");
  }
);

// Profile route (only accessible when authenticated)
router.get("/profile", (req, res) => {
  if (req.isAuthenticated()) { //(!req.isAuthenticated)
    res.send("Please login to continue.");  // Show logout message
    return res.redirect("/");
  }
  res.send(`Hello, ${req.user.username}`);
});

// Logout route (show message "Logged out" after successful logout)
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);  // Handle any errors during logout

    // Destroy the session
    req.session.destroy((err) => {
      if (err) return next(err);  // Handle any session destruction errors
      res.clearCookie('connect.sid');  // Clears the session cookie
      res.send("You have successfully logged out.");  // Show logout message
    });
  });
});

// Validation route for clients
router.post("/clients", userValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.send("Data is valid and added successfully");
});

// Catch-all for 404 errors
router.use((req, res, next) => {
  const error = new Error('Path Not Found');
  error.status = 404;
  next(error);
});

module.exports = router;
