// Should NOT trigger any rules — using UID instead of email
const admin = require("firebase-admin");

async function handleSignIn(uid) {
  // SAFE: resolving user by immutable UID
  const user = await admin.auth().getUser(uid);
  return user;
}
