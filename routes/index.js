const express = require('express');
const router = express.Router();
const { userValidation } = require("../middleware/validator.js");
const passport = require('passport');
const bodyParser = require("body-parser");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const dotenv = require('dotenv').config();
const cors = require("cors");


//Routes connection
router.use('/user', require('./user'));
router.use('/clients', require('./clients'))
router.use("/", require("./swagger"));

// Login
router.get('/login', passport.authenticate('github'), (req, res) => {});

//Logout
router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Github callback route
router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    async function(req, res) {
        // Successful authentication, redirect home.
        req.session.user = req.user;
        console.log("session user", req.session.user)
        const { Octokit } = await import("@octokit/rest");
        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });

        octokit.request('GET /user/installations', {}).then((result) => {
           // console.log(result.data);
        });
        res.redirect("/");
    });



// // Routes
// router.get("/", (req, res) => {
//     res.send("Node.js API for user validation");
//   });

// router.get('/',(req,res) => {res.send('Hello World')});

// // Setting Access-Control headers
// router.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
//   });





router.get("/", (req, res) => {
    res.send(
        req.session.user !== undefined ?
            `Logged in as ${req.session.user.displayName}` :
            "Logged Out"
    );
});



// Validation Route
router.post("/clients", userValidation, (req, res, next) => {
    const { firstName, lastName, email, favoriteColor, birthday, nickname, gender } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.send("Data is valid and added sucesfully");
});




router.use((req, res, next) => {
    const error = new Error('Path Not Found');
    error.status = 404;
    next(error);
});


// from here

// router
//   .use(bodyParser.json())
//   .use(
//     session({
//       secret: "secret",
//       resave: false,
//       saveUninitialized: true,
//     })
//   )

//   .use(passport.initialize())
//   .use(passport.session())

//   .use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "X-Requested-With,content-type"
//     );
//     res.setHeader("Access-Control-Allow-Credentials", true);
//     next();
//   })
//   .use(cors({ method: ["GET", "POST", "DELETE", "PUT", "OPTIONS", "UPDATE"] }))
//   .use(cors({ origin: "*" }))
//   .use("/", require("../routes"));


// passport.use(
//     new GitHubStrategy(
//       {
//         clientID: process.env.GITHUB_CLIENT_ID,
//         ClientSecret: process.env.GITHUB_CLIENT_SECRET,
//         callbackURL: process.env.CALLBACK_URL,
//       },
//       function (accesToken, refreshToken, profile, done) {
//         //User.findorCreate({github:Id profileId},function (err,user)){
//         return done(null, profile);
//         //});
//       }
//     )
//   );

//   //Encrypt and Decrypt user
//   passport.serializeUser((user, done) => {
//     done(null, user);
//   });
//   passport.deserializeUser((user, done) => {
//     done(null, user);
//   });


// Comment able till here

module.exports = router;
