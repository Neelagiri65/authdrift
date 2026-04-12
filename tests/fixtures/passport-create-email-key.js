// TRUE POSITIVE: passport handler using email as DB creation key (no lookup)
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const user = await User.findOrCreate({ email: profile.emails[0].value, name: profile.displayName });
  return done(null, user);
}));
