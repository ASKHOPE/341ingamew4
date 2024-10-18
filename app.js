const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongodb = require("./db/connect");
const passport = require("./middleware/passport"); // Passport configuration

const port = process.env.PORT || 8080;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: "yourSecretKey",  // A strong secret for session encryption
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/", require("./routes/index.js"));

// app.get('/',(req,res)=> {res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.username}` : "Logged Out")});

// // GitHub callback route
// app.get(
//   "/auth/github/callback",
//   passport.authenticate("github", { failureRedirect: "/",session: false }),//,session:false reauthentication
//   (req, res) => {
//     req.session.user = req.user;
//     // Successful authentication
//     res.redirect("/profile");
//   }
// );

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

// Setting Access-Control headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Error handling
app.use((err, req, res, next) => {
  console.log(err)
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    message: err.message,
  });
});

// Error handler 2
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});
