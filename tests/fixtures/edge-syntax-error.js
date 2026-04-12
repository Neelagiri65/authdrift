// EDGE CASE: file with syntax errors — should not crash semgrep
const passport = require('passport'
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  // Missing closing brackets
  const user = await db.findUser({ email: profile.emails[0].value )};
