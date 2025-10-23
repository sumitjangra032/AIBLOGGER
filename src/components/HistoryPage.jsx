// components/HistoryPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { History, Calendar, Filter, Search, ChevronDown } from "lucide-react";
// import { useTheme } from "../contexts/ThemeContext";
import { BLOG_CATEGORIES } from "../types/blog";
import { blogService } from "../services/blogServices";
import BlogCard from "./BlogCard";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
// import { DocumentSnapshot } from "firebase/firestore";

export default function HistoryPage(){
  const darkMode = false;
  const [user] = useAuthState(auth);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    loadInitialBlogs();
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = blogService.getUserBookmarks(user.uid, setBookmarks);
      return unsubscribe;
    } else {
      setBookmarks([]);
    }
  }, [user]);

  // Filter blogs
  useEffect(() => {
    let filtered = blogs;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((blog) => blog.category === selectedCategory);
    }

    // Filter by date
    if (dateFilter !== "all") {
      const now = new Date();
      let cutoffDate;

      switch (dateFilter) {
        case "today":
          cutoffDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          break;
        case "week":
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "year":
          cutoffDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          cutoffDate = new Date(0);
      }

      filtered = filtered.filter((blog) => {
        const blogDate = blog.createdAt?.toDate
          ? blog.createdAt.toDate()
          : new Date(blog.createdAt);
        return blogDate >= cutoffDate;
      });
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
  }, [blogs, selectedCategory, dateFilter, searchTerm]);

  const loadInitialBlogs = async () => {
    try {
      const { blogs: initialBlogs, lastDoc: newLastDoc } =
        await blogService.getBlogsWithPagination();
      setBlogs(initialBlogs);
      setLastDoc(newLastDoc);
      setHasMore(initialBlogs.length === 20);
    } catch (error) {
      console.error("Error loading blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreBlogs = async () => {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);
    try {
      const { blogs: moreBlogs, lastDoc: newLastDoc } =
        await blogService.getBlogsWithPagination(lastDoc);
      setBlogs((prev) => [...prev, ...moreBlogs]);
      setLastDoc(newLastDoc);
      setHasMore(moreBlogs.length === 20);
    } catch (error) {
      console.error("Error loading more blogs:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleBookmarkToggle = async (blogId) => {
    if (!user) return;

    const isBookmarked = bookmarks.some(
      (bookmark) => bookmark.blogId === blogId,
    );

    try {
      if (isBookmarked) {
        await blogService.removeBookmark(user.uid, blogId);
      } else {
        await blogService.addBookmark(user.uid, blogId);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleViewIncrement = useCallback(async (blogId) => {
    try {
      await blogService.incrementViews(blogId);
    } catch (error) {
      console.error("Error incrementing views:", error);
    }
  }, []);

  const isBookmarked = (blogId) => {
    return bookmarks.some((bookmark) => bookmark.blogId === blogId);
  };

  const groupBlogsByDate = (blogs) => {
    const groups = {};

    blogs.forEach((blog) => {
      const date = blog.createdAt?.toDate
        ? blog.createdAt.toDate()
        : new Date(blog.createdAt);
      const dateKey = date.toDateString();

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(blog);
    });

    return Object.entries(groups).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime(),
    );
  };

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

  const groupedBlogs = groupBlogsByDate(filteredBlogs);

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
              <History
                className={`w-8 h-8 ${
                  darkMode ? "text-blue-400" : "text-sky-600"
                }`}
              />
            </div>
          </div>
          <h1
            className={`text-4xl font-bold mb-4 ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            Blog History
          </h1>
          <p
            className={`text-lg ${
              darkMode ? "text-slate-300" : "text-slate-600"
            }`}
          >
            Explore all published articles
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            />
            <input
              type="text"
              placeholder="Search all blogs..."
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

          {/* Date Filter */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={`appearance-none px-4 py-3 pr-8 rounded-lg border transition-colors duration-200 ${
                darkMode
                  ? "bg-slate-800 border-slate-600 text-white focus:border-blue-400"
                  : "bg-white border-sky-200 text-slate-800 focus:border-sky-400"
              } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                darkMode ? "focus:ring-blue-400" : "focus:ring-sky-400"
              }`}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <Calendar
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            />
          </div>
        </div>

        {/* Results Info */}
        <div
          className={`mb-6 text-center ${darkMode ? "text-slate-300" : "text-slate-600"}`}
        >
          {searchTerm || selectedCategory !== "all" || dateFilter !== "all" ? (
            <span>
              Found {filteredBlogs.length} result
              {filteredBlogs.length !== 1 ? "s" : ""}
            </span>
          ) : (
            <span>Showing {blogs.length} total articles</span>
          )}
        </div>

        {/* Content */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16">
            <div
              className={`text-6xl mb-4 ${darkMode ? "text-slate-600" : "text-slate-300"}`}
            >
              🔍
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              No articles found
            </h3>
            <p
              className={`mb-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setDateFilter("all");
              }}
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-sky-500 hover:bg-sky-600 text-white"
              }`}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {groupedBlogs.map(([dateKey, dayBlogs]) => (
              <section key={dateKey}>
                {/* Date Header */}
                <div
                  className={`flex items-center mb-6 ${
                    darkMode ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  <h2 className="text-lg font-semibold">
                    {new Date(dateKey).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h2>
                  <div
                    className={`flex-1 h-px ml-4 ${
                      darkMode ? "bg-slate-700" : "bg-slate-200"
                    }`}
                  ></div>
                  <span
                    className={`ml-4 text-sm ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {dayBlogs.length} article{dayBlogs.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Blog Grid for this date */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dayBlogs.map((blog) => (
                    <BlogCard
                      key={blog.id}
                      blog={blog}
                      isBookmarked={isBookmarked(blog.id)}
                      onBookmarkToggle={handleBookmarkToggle}
                      onViewIncrement={handleViewIncrement}
                    />
                  ))}
                </div>
              </section>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center py-8">
                <button
                  onClick={loadMoreBlogs}
                  disabled={loadingMore}
                  className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-colors duration-200 mx-auto ${
                    darkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:bg-slate-700 disabled:text-slate-500"
                      : "bg-white hover:bg-slate-50 text-slate-700 shadow-sm border border-sky-200 disabled:bg-slate-100 disabled:text-slate-400"
                  }`}
                >
                  {loadingMore ? (
                    <>
                      <div
                        className={`animate-spin rounded-full h-4 w-4 border-b-2 ${
                          darkMode ? "border-slate-400" : "border-slate-500"
                        }`}
                      ></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      <span>Load More Articles</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* End of results message */}
            {!hasMore && blogs.length > 0 && (
              <div
                className={`text-center py-8 border-t ${
                  darkMode
                    ? "border-slate-700 text-slate-400"
                    : "border-slate-200 text-slate-500"
                }`}
              >
                <p>You've reached the end of our archive!</p>
                <p className="text-sm mt-2">
                  That's all {blogs.length} articles we have.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}