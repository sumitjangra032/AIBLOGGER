// components/BookmarksPage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bookmark, BookmarkX, Search, Filter } from "lucide-react";
// import { useTheme } from "../contexts/ThemeContext";
// import { Blog, Bookmark as BookmarkType, BLOG_CATEGORIES } from "../types/blog";
import { BLOG_CATEGORIES } from "../types/blog";
import { blogService } from "../services/blogServices";
import BlogCard from "./BlogCard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function BookmarksPage(){
  const darkMode = false;
  const [user] = useAuthState(auth);
  const [bookmarks, setBookmarks] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = blogService.getUserBookmarks(
      user.uid,
      async (userBookmarks) => {
        setBookmarks(userBookmarks);

        // Fetch the actual blog data for each bookmark
        const blogPromises = userBookmarks.map(async (bookmark) => {
          try {
            const blogDoc = await getDoc(doc(db, "blogs", bookmark.blogId));
            if (blogDoc.exists()) {
              return { id: blogDoc.id, ...blogDoc.data() };
            }
            return null;
          } catch (error) {
            console.error("Error fetching blog:", error);
            return null;
          }
        });

        const blogResults = await Promise.all(blogPromises);
        const validBlogs = blogResults.filter(
          (blog) => blog !== null,
        );
        setBlogs(validBlogs);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [user]);

  // Filter blogs based on search term and category
  useEffect(() => {
    let filtered = blogs;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((blog) => blog.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(term) ||
          blog.content.toLowerCase().includes(term) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(term)) ||
          blog.author.toLowerCase().includes(term),
      );
    }

    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, selectedCategory]);

  const handleBookmarkToggle = async (blogId) => {
    if (!user) return;

    try {
      await blogService.removeBookmark(user.uid, blogId);
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const handleViewIncrement = async (blogId) => {
    try {
      await blogService.incrementViews(blogId);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  };

  if (!user) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-gradient-to-br from-sky-50 to-blue-100"}`}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div
              className={`text-6xl mb-4 ${darkMode ? "text-slate-600" : "text-slate-300"}`}
            >
              🔒
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Sign in required
            </h3>
            <p
              className={`mb-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              You need to sign in to view your bookmarks.
            </p>
            <Link
              to="/signin"
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-sky-500 hover:bg-sky-600 text-white"
              }`}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-gradient-to-br from-sky-50 to-blue-100"}`}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div
              className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
                darkMode ? "border-blue-400" : "border-sky-500"
              }`}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        darkMode ? "bg-slate-900" : "bg-gradient-to-br from-sky-50 to-blue-100"
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className={`p-4 rounded-full ${
                darkMode ? "bg-slate-800" : "bg-white shadow-sm"
              }`}
            >
              <Bookmark
                className={`w-8 h-8 ${
                  darkMode ? "text-yellow-400" : "text-yellow-600"
                }`}
              />
            </div>
          </div>
          <h1
            className={`text-4xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            My Bookmarks
          </h1>
          <p
            className={`text-lg ${
              darkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Your saved articles in one place
          </p>
        </div>

        {/* Search and Filter */}
        {blogs.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search your bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 ${
                  darkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400"
                    : "bg-white border-sky-200 text-slate-800 placeholder-slate-500 focus:border-sky-400"
                } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  darkMode ? "focus:ring-blue-400" : "focus:ring-sky-400"
                }`}
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`appearance-none px-4 py-3 pr-8 rounded-lg border transition-colors duration-200 ${
                  darkMode
                    ? "bg-slate-800 border-slate-600 text-white focus:border-blue-400"
                    : "bg-white border-sky-200 text-slate-800 focus:border-sky-400"
                } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  darkMode ? "focus:ring-blue-400" : "focus:ring-sky-400"
                }`}
              >
                <option value="all">All Categories</option>
                {BLOG_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Filter
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              />
            </div>
          </div>
        )}

        {/* Results Info */}
        {searchTerm && blogs.length > 0 && (
          <div
            className={`mb-6 text-center ${darkMode ? "text-slate-300" : "text-slate-600"}`}
          >
            Found {filteredBlogs.length} result
            {filteredBlogs.length !== 1 ? "s" : ""} for "{searchTerm}"
          </div>
        )}

        {/* Bookmarks Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16">
            <div
              className={`text-6xl mb-4 ${darkMode ? "text-slate-600" : "text-slate-300"}`}
            >
              {blogs.length === 0 ? "📖" : "🔍"}
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              {blogs.length === 0
                ? "No bookmarks yet"
                : "No matching bookmarks"}
            </h3>
            <p
              className={`mb-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              {blogs.length === 0
                ? "Start bookmarking articles you want to read later!"
                : "Try adjusting your search terms or filters"}
            </p>
            {blogs.length === 0 && (
              <Link
                to="/"
                className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-sky-500 hover:bg-sky-600 text-white"
                }`}
              >
                Discover Articles
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Stats */}
            <div
              className={`text-sm mb-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Showing {filteredBlogs.length} of {blogs.length} bookmarked
              articles
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <div key={blog.id} className="relative">
                  <BlogCard
                    blog={blog}
                    isBookmarked={true}
                    onBookmarkToggle={handleBookmarkToggle}
                    onViewIncrement={handleViewIncrement}
                  />
                  {/* Remove bookmark indicator */}
                  <div
                    className={`absolute top-4 right-4 p-2 rounded-full ${
                      darkMode ? "bg-slate-800/90" : "bg-white/90"
                    } backdrop-blur-sm`}
                  >
                    <BookmarkX
                      className={`w-4 h-4 ${
                        darkMode ? "text-yellow-400" : "text-yellow-600"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Bottom Navigation */}
        {blogs.length > 0 && (
          <div className="text-center mt-12 pt-8 border-t border-opacity-20 border-slate-300">
            <Link
              to="/"
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                darkMode
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  : "bg-white hover:bg-slate-50 text-slate-700 shadow-sm border border-sky-200"
              }`}
            >
              Browse More Articles
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

