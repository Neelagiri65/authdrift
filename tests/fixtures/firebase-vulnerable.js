// Should trigger firebase-auth-getUserByEmail
const admin = require("firebase-admin");

async function handleSignIn(email) {
  // VULNERABLE: resolving user by email instead of UID
  const user = await admin.auth().getUserByEmail(email);
  return user;
}
