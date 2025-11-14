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
} from "firebase/firestore";

import { db } from "../firebase";

export const blogService = {
  
    getLatestBlogs: (callback) => {
    const q = query(
      collection(db, "blogs"),
      orderBy("createdAt", "desc"),
      limit(60),
    );

    return onSnapshot(q, (snapshot) => {
      const blogs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(blogs);
    });
  },

  searchBlogs: async (searchTerm, category) => {
    let q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));

    if (category) {
      q = query(q, where("category", "==", category));
    }

    const snapshot = await getDocs(q);
    const allBlogs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return allBlogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
  },

  getBlogsWithPagination: async (
    lastDoc,
    limitCount = 20,
  ) => {
    let q = query(
      collection(db, "blogs"),
      orderBy("createdAt", "desc"),
      limit(limitCount),
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const blogs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      blogs,
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
    };
  },


  incrementViews: async (blogId) => {

  try {
    const blogRef = doc(db, "blogs", blogId);
    
    await updateDoc(blogRef, {
      views: increment(1),
    });

    console.log(`Successfully incremented views for blog: ${blogId}`);
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
},

  addBookmark: async (userId, blogId) => {
    await addDoc(collection(db, "bookmarks"), {
      userId,
      blogId,
      createdAt: serverTimestamp(),
    });
  },

  removeBookmark: async (userId, blogId) => {
    const q = query(
      collection(db, "bookmarks"),
      where("userId", "==", userId),
      where("blogId", "==", blogId),
    );

    const snapshot = await getDocs(q);
    snapshot.docs.forEach(async (document) => {
      await deleteDoc(doc(db, "bookmarks", document.id));
    });
  },

  getUserBookmarks: (
    userId,
    callback,
  ) => {
    const q = query(
      collection(db, "bookmarks"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    );

    return onSnapshot(q, (snapshot) => {
      const bookmarks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(bookmarks);
    });
  },
};