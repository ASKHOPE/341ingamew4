const mongodb = require("./db/connect");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const dotenv = require('dotenv').config();

const port = process.env.PORT || 8080;
const app = express();


app
    .use(bodyParser.json())
    .use(
        session({
            secret: "secret",
            resave: false,
            saveUninitialized: true,
        })
    )

    .use(passport.initialize())
    .use(passport.session())

    .use(cors({
        origin: "*",
        credentials: true,
        methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS", "UPDATE"]
    }))
    .use("/", require("./routes"));

//
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
        },
        async function(accesToken, refreshToken, profile, done) {
            return done(null, profile);
        }
    )
);

//Encrypt and Decrypt user
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// app.get('/github/callback',
//     passport.authenticate('github', { failureRedirect: '/login' }),
//     async function(req, res) {
//         req.session.user = req.user;
//         console.log("session user", req.session.user);

//         try {
//             const { Octokit } = await import("@octokit/rest");
//             const octokit = new Octokit({
//                 auth: process.env.GITHUB_TOKEN
//             });

//             const result = await octokit.request('GET /user/installations', {});
//             //console.log(result.data);
//         } catch (error) {
//             console.error("Error fetching GitHub installations:", error);
//             // Handle the error appropriately, e.g., send an error response to the client
//             res.status(500).send("Error fetching GitHub installations");
//             return;
//         }
//         res.redirect("/");
//     });


    app.get("/", (req, res) => {
        res.send(
            req.session.user !== undefined ?
                `Logged in as ${req.session.user.displayName}` :
                "Logged Out"
        );
    });


// Initialize MongoDB and start server

mongodb.initDb((err, db) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Connected to DB and listening on port ${port}`);
        });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
        message: err.message,
    });
});