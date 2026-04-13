// Should trigger lucia-auth-email-as-primary-key
import { db } from "./db";

async function handleGoogleCallback(googleUser) {
  const email = googleUser.email;

  // VULNERABLE: keying on email instead of provider subject ID
  const existingUser = await db.table("user").where("email", "=", email);
  return existingUser;
}
