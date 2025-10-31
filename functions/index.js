import { setGlobalOptions } from "firebase-functions";
setGlobalOptions({ maxInstances: 10 });

import { onSchedule } from "firebase-functions/v2/scheduler";
import { FieldValue } from "firebase-admin/firestore";

import { blogServiceNew } from "./services/handleblogs.js";
import { db } from "./firebase.js";

export const refreshBlogs = onSchedule("every 60 minutes",async () => {
    console.log("🔄 Running blog refresh...");

    try {
      await blogServiceNew.generateBlogs(1);

      await db.collection("meta").doc("refreshStatus").set({
        lastRefresh: FieldValue.serverTimestamp(),
      });

      console.log("✅ Blogs refreshed at", new Date().toISOString());
    } catch (err) {
      console.error("❌ Error refreshing blogs:", err);
    }
  }
);
