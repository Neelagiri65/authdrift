// TRUE NEGATIVE: email mentioned in comments only, not in code
// This handler uses profile.emails[0].value... just kidding, it uses profile.id
// The email field from the OAuth profile should NOT be used as a primary key.
// See: https://github.com/Neelagiri65/authdrift for why.

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const user = await db.findUser({ googleId: profile.id });
  return done(null, user);
}));
