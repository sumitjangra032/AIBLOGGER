import {
  collection,      // Reference to a collection
  query,           // Create a query
  orderBy,         // Order query results
  limit,           // Limit number of results
  onSnapshot,       // Real-time listener
  where,           // Filter query results
  getDocs,         // Get documents from query
  addDoc,          // Add new document
  deleteDoc,       // Delete document
  doc,             // Reference to a document
  updateDoc,       // Update document
  increment,       // Increment field value
  serverTimestamp, // Server timestamp
  startAfter      // Pagination cursor
 // Document snapshot type
} from "firebase/firestore";

// import {GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../firebase";

// Main blog service object with all database operations
export const blogService = {
  
    getLatestBlogs: (callback) => {
    // Create query for blogs collection, ordered by creation date (newest first), limited to 10
    const q = query(
      collection(db, "blogs"),
      orderBy("createdAt", "desc"),
      limit(60),
    );

    // Set up real-time listener that calls callback whenever data changes
    return onSnapshot(q, (snapshot) => {
      // Transform Firestore documents to Blog objects
      const blogs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Call the provided callback with the blogs array
      callback(blogs);
    });
  },

  // Search blogs by term and optional category
  searchBlogs: async (searchTerm, category) => {
    // Start with basic query ordered by creation date
    let q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));

    if (category) {
      q = query(q, where("category", "==", category));
    }

    // Execute query and get all matching documents
    const snapshot = await getDocs(q);
    // Transform Firestore documents to Blog objects
    const allBlogs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Client-side filtering for search term (searches title, content, and tags)
    return allBlogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
  },

  // Get paginated blogs for history page with cursor-based pagination
  getBlogsWithPagination: async (
    lastDoc,
    limitCount = 20,
  ) => {
    // Create base query ordered by creation date, limited to specified count
    let q = query(
      collection(db, "blogs"),
      orderBy("createdAt", "desc"),
      limit(limitCount),
    );

    // Add pagination cursor if provided (for "load more" functionality)
    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    // Execute query and get documents
    const snapshot = await getDocs(q);
    // Transform documents to Blog objects
    const blogs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return blogs and last document for next page pagination
    return {
      blogs,
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
    };
  },

  // // Increment view count for a specific blog
  // incrementViews: async (blogId) => {
  //   // Get reference to specific blog document
  //   const blogRef = doc(db, "blogs", blogId);
  //   // Atomically increment views field by 1
  //   await updateDoc(blogRef, {
  //     views: increment(1),
  //   });
  // },

  incrementViews: async (blogId) => {
  // console.log(`incrementViews called for blog: ${blogId}`);
  // console.trace(`Stack trace for blog: ${blogId}`); // shows where it was called from

  try {
    // Get reference to specific blog document
    const blogRef = doc(db, "blogs", blogId);
    
    // Atomically increment views field by 1
    await updateDoc(blogRef, {
      views: increment(1),
    });

    console.log(`Successfully incremented views for blog: ${blogId}`);
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
},

  // Bookmark operations
  // Add a bookmark for a user and blog
  addBookmark: async (userId, blogId) => {
    // Add new bookmark document to bookmarks collection
    await addDoc(collection(db, "bookmarks"), {
      userId,
      blogId,
      createdAt: serverTimestamp(),
    });
  },

  // Remove a bookmark for a user and blog
  removeBookmark: async (userId, blogId) => {
    // Query to find bookmark documents for specific user and blog
    const q = query(
      collection(db, "bookmarks"),
      where("userId", "==", userId),
      where("blogId", "==", blogId),
    );

    // Get all matching bookmark documents
    const snapshot = await getDocs(q);
    // Delete each matching bookmark document
    snapshot.docs.forEach(async (document) => {
      await deleteDoc(doc(db, "bookmarks", document.id));
    });
  },

  // Get user's bookmarks with real-time updates
  getUserBookmarks: (
    userId,
    callback,
  ) => {
    // Query bookmarks for specific user, ordered by creation date
    const q = query(
      collection(db, "bookmarks"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );

    // Set up real-time listener for user's bookmarks
    return onSnapshot(q, (snapshot) => {
      // Transform documents to Bookmark objects
      const bookmarks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Call callback with bookmarks array
      callback(bookmarks);
    });
  },

  // Clean up old blogs to keep only the latest 100

};
