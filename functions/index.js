/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
// 1. IMPORT THE ADMIN SDK AND INITIALIZATION FUNCTION
// import { initializeApp } from "firebase-admin/app"; 


// ... (Your setGlobalOptions code)
setGlobalOptions({ maxInstances: 10 });

// 2. INITIALIZE THE ADMIN SDK (IDEMPOTENTLY)
// This is the CRITICAL missing piece that ensures services like getFirestore() work.
// if (initializeApp().name !== '[DEFAULT]') { 
//     initializeApp(); 
// }

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


import { onSchedule } from "firebase-functions/v2/scheduler";
// import { getFirestore, FieldValue } from "firebase-admin/firestore";
import {FieldValue } from "firebase-admin/firestore";

import { blogServiceNew } from "./services/handleblogs.js";


// const db = getFirestore();
import { db } from "./firebase.js";

export const refreshBlogs = onSchedule("every 60 minutes", async (event) => {
  console.log("🔄 Running hourly blog refresh...");

  try {
    
    
    const blogsRef = db.collection("blogs");
    const snapshot = await blogsRef.get();

    for (const doc of snapshot.docs) {
      await doc.ref.update({
        refreshed: true,
        refreshedAt: FieldValue.serverTimestamp(),
      });
    }

    await blogServiceNew.generateBlogs();
    await blogServiceNew.cleanupOldBlogs();

    // Update shared last refresh timestamp
    await db.collection("meta").doc("refreshStatus").set({
      lastRefresh: FieldValue.serverTimestamp(),
    });

    console.log("✅ Blogs refreshed successfully at", new Date().toISOString());
  } catch (err) {
    console.error("❌ Error refreshing blogs:", err);
  }
});