const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

// Environment variables for client ID and secret
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "https://three41ingamew4.onrender.com/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // Here, you can save the user's profile data to the database
      // or return the profile to the next middleware.
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user for session support
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
  console.log(user.id);
});


module.exports = passport;
