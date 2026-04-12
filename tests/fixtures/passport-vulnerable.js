// Should trigger oauth-passport-email-as-primary-key
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  const user = await db.findUser({ email: profile.emails[0].value });
  if (!user) {
    return db.createUser({ email: profile.emails[0].value, name: profile.displayName }, done);
  }
  return done(null, user);
}));
