// Should NOT trigger — keys on profile.id (the OIDC sub claim)
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  // Email is recorded as a contact attribute, but the lookup key is the immutable sub.
  const user = await db.findUser({ googleId: profile.id });
  if (!user) {
    return db.createUser({
      googleId: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
    }, done);
  }
  return done(null, user);
}));
