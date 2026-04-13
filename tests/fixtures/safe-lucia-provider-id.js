// Should NOT trigger any rules — using provider subject ID
import { db } from "./db";

async function handleGoogleCallback(googleUser) {
  const providerUserId = googleUser.sub;

  // SAFE: keying on provider's immutable subject ID
  const existingUser = await db
    .table("oauth_account")
    .where("provider_user_id", "=", providerUserId);
  return existingUser;
}
