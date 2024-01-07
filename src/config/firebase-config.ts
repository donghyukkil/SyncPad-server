import admin from "firebase-admin";

import serviceAccount from "./ServiceAccount.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

module.exports = admin;
