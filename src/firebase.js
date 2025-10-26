// Firebase configuration and initialization
// Import Firebase SDK functions for app initialization
import { initializeApp } from "firebase/app";
// Import Firestore database functions
import { getFirestore } from "firebase/firestore";
// Import Firebase Authentication functions
import { getAuth } from "firebase/auth";
// Import Firebase Storage functions
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase app with configuration
const app = initializeApp(firebaseConfig);
// Initialize Firestore database instance
const db = getFirestore(app);
// Initialize Firebase Authentication instance
const auth = getAuth(app);
// Initialize Firebase Storage instance
const storage = getStorage(app);

// Export Firebase services for use throughout the application
export { db, auth, storage };

// import admin from "firebase-admin";
// import fs from "fs";
// import path, { dirname, join } from "path";
// import { fileURLToPath } from "url";

// // ES module __dirname fix
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// // Initialize Firebase Admin
// const serviceAccount = JSON.parse(
//   fs.readFileSync(join(__dirname, "../firebasekey.json"), "utf-8")
// );

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: `${serviceAccount.project_id}.appspot.com`,
// });

// const db = admin.firestore();
// const bucket = admin.storage().bucket();

// // Author images folder
// const AUTHOR_IMAGES_DIR = join(__dirname, "../public/author_images");
// const imageFiles = fs
//   .readdirSync(AUTHOR_IMAGES_DIR)
//   .filter(f => f.endsWith(".jpg") || f.endsWith(".png"));

// // Shuffle array helper
// function shuffleArray(array) {
//   return array.sort(() => Math.random() - 0.5);
// }

// // Cycle through images without repeating until all used
// function* imageGenerator(images) {
//   let imgs = [...images];
//   while (true) {
//     if (imgs.length === 0) imgs = [...images]; // refill when empty
//     const index = Math.floor(Math.random() * imgs.length);
//     yield imgs.splice(index, 1)[0];
//   }
// }

// async function updateBlogAuthors() {
//   const blogsSnapshot = await db.collection("blogs").get();
//   if (blogsSnapshot.empty) {
//     console.log("No blogs found!");
//     return;
//   }

//   const gen = imageGenerator(imageFiles);

//   for (const doc of blogsSnapshot.docs) {
//     const randomImage = gen.next().value;
//     const parsedName = randomImage.replace(/\.(jpg|png)$/i, "");
//     const localPath = join(AUTHOR_IMAGES_DIR, randomImage);
//     // const storagePath = `authors/blogs/${doc.id}/${randomImage}`;

//     // Upload to Firebase Storage
//     // await bucket.upload(localPath, { destination: storagePath });
//     // const imageUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

//     // Update Firestore
//     await doc.ref.update({ author: parsedName});

//     console.log(`✅ Updated blog ${doc.id} with author ${parsedName}`);
//   }

//   console.log("\n🎯 All blogs updated successfully!");
// }

// // Run
// updateBlogAuthors().catch(console.error);
