import * as functions from "firebase-functions";
import { admin } from "../admin";

/**
 * Callable function to promote a user to admin. Run manually once (e.g.
 * via the Firebase console's "Run function" or a one-off script) to bootstrap
 * your first admin — after that, only existing admins can call it.
 */
export const grantAdminRole = functions.https.onCall(async (data, context) => {
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError("permission-denied", "Only an existing admin can grant admin role.");
  }
  const user = await admin.auth().getUserByEmail(data.email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  return { success: true };
});
