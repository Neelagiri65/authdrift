// TRUE NEGATIVE: email used for display/logging only, not as a DB key
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  console.log(`Login attempt from: ${profile.emails[0].value}`);
  const user = await db.findUser({ googleId: profile.id });
  if (user) {
    user.lastEmail = profile.emails[0].value;
    await user.save();
  }
  return done(null, user);
}));
