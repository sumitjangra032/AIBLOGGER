// components/BlogDetail.tsx
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Share,
  Eye,
  Calendar,
  Tag,
  Twitter,
  Linkedin,
  MessageCircle,
  ExternalLink,
  Clock,
} from "lucide-react";
// import { useTheme } from "../contexts/ThemeContext";
// import { Blog, Bookmark as BookmarkType } from '../types/blog';
import { blogService } from "../services/blogServices";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function BlogDetail(){
  const darkMode = false;
  const { id } = useParams();
  const [user] = useAuthState(auth);
  const [blog, setBlog] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (id) {
      loadBlog(id);
      // Increment view count
      // blogService.incrementViews(id);
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      const unsubscribe = blogService.getUserBookmarks(user.uid, setBookmarks);
      return unsubscribe;
    } else {
      setBookmarks([]);
    }
  }, [user]);

  // Update page title and meta tags
  useEffect(() => {
    if (blog) {
      document.title = `${blog.title} - SkyBlogs`;

      // Update meta description
      const metaDescription = document.querySelector(
        'meta[name="description"]',
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", blog.excerpt);
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = blog.excerpt;
        document.head.appendChild(meta);
      }

      // Update Open Graph tags
      updateMetaTag("og:title", blog.title);
      updateMetaTag("og:description", blog.excerpt);
      updateMetaTag("og:image", blog.imageUrl || "");
      updateMetaTag("og:url", window.location.href);

      // Update Twitter Card tags
      updateMetaTag("twitter:title", blog.title);
      updateMetaTag("twitter:description", blog.excerpt);
      updateMetaTag("twitter:image", blog.imageUrl || "");
    }

    return () => {
      document.title = "SkyBlogs";
    };
  }, [blog]);

  const updateMetaTag = (property, content) => {
    let meta =
      document.querySelector(`meta[property="${property}"]`) ||
      document.querySelector(`meta[name="${property}"]`);

    if (meta) {
      meta.setAttribute("content", content);
    } else {
      meta = document.createElement("meta");
      if (property.startsWith("og:") || property.startsWith("twitter:")) {
        meta.setAttribute("property", property);
      } else {
        meta.setAttribute("name", property);
      }
      meta.setAttribute("content", content);
      document.head.appendChild(meta);
    }
  };

  const loadBlog = async (blogId) => {
    try {
      const blogDoc = await getDoc(doc(db, "blogs", blogId));
      if (blogDoc.exists()) {
        setBlog({ id: blogDoc.id, ...blogDoc.data() });
      }
    } catch (error) {
      console.error("Error loading blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(" ").length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  const handleBookmarkToggle = async () => {
    if (!user || !blog) return;

    const isBookmarked = bookmarks.some(
      (bookmark) => bookmark.blogId === blog.id,
    );

    try {
      if (isBookmarked) {
        await blogService.removeBookmark(user.uid, blog.id);
      } else {
        await blogService.addBookmark(user.uid, blog.id);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog?.title || "")}&url=${encodeURIComponent(window.location.href)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent((blog?.title || "") + " - " + window.location.href)}`,
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowShareMenu(false);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const isBookmarked = blog
    ? bookmarks.some((bookmark) => bookmark.blogId === blog.id)
    : false;

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

  if (!blog) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-gradient-to-br from-sky-50 to-blue-100"}`}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div
              className={`text-6xl mb-4 ${darkMode ? "text-slate-600" : "text-slate-300"}`}
            >
              📝
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                darkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Blog not found
            </h3>
            <p
              className={`mb-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              The blog you're looking for might have been removed or doesn't
              exist.
            </p>
            <Link
              to="/"
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-sky-500 hover:bg-sky-600 text-white"
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
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
        {/* Back Button */}
        <Link
          to="/"
          className={`inline-flex items-center mb-8 text-sm font-medium transition-colors duration-200 ${
            darkMode
              ? "text-slate-400 hover:text-blue-400"
              : "text-slate-600 hover:text-sky-600"
          }`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Article */}
        <article
          className={`max-w-4xl mx-auto ${
            darkMode ? "bg-slate-800" : "bg-white"
          } rounded-2xl shadow-xl overflow-hidden`}
        >
          {/* Hero Image */}
          {blog.imageUrl && (
            <div className="aspect-video overflow-hidden">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Category and Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  darkMode
                    ? "bg-blue-900 text-blue-200"
                    : "bg-sky-100 text-sky-700"
                }`}
              >
                {blog.category}
              </span>
              <div
                className={`flex items-center text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(blog.createdAt)}
              </div>
              <div
                className={`flex items-center text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <Clock className="w-4 h-4 mr-2" />
                {calculateReadTime(blog.content)} min read
              </div>
              <div
                className={`flex items-center text-sm ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              >
                <Eye className="w-4 h-4 mr-2" />
                {blog.views || 0} views
              </div>
            </div>

            {/* Title */}
            <h1
              className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {blog.title}
            </h1>

            {/* Author and Actions */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-opacity-20 border-slate-300">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                    darkMode
                      ? "bg-slate-700 text-slate-300"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {blog.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div
                    className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}
                  >
                    {blog.author}
                  </div>
                  <div
                    className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                  >
                    Author
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 relative">
                {/* Bookmark Button */}
                <button
                  onClick={handleBookmarkToggle}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isBookmarked
                      ? darkMode
                        ? "bg-yellow-600 text-yellow-100"
                        : "bg-yellow-500 text-white"
                      : darkMode
                        ? "border border-slate-600 hover:bg-slate-700 text-slate-300"
                        : "border border-slate-300 hover:bg-slate-50 text-slate-700"
                  }`}
                  disabled={!user}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                  <span className="hidden md:inline">
                    {isBookmarked ? "Bookmarked" : "Bookmark"}
                  </span>
                </button>

                {/* Share Button */}
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    darkMode
                      ? "border border-slate-600 hover:bg-slate-700 text-slate-300"
                      : "border border-slate-300 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <Share className="w-4 h-4" />
                  <span className="hidden md:inline">Share</span>
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div
                    className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border z-10 ${
                      darkMode
                        ? "bg-slate-800 border-slate-600"
                        : "bg-white border-sky-200"
                    } py-2`}
                  >
                    <a
                      href={shareUrls.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center px-4 py-2 text-sm hover:bg-opacity-80 transition-colors ${
                        darkMode
                          ? "text-slate-300 hover:bg-slate-700"
                          : "text-slate-700 hover:bg-sky-50"
                      }`}
                      onClick={() => setShowShareMenu(false)}
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Share on Twitter
                    </a>
                    <a
                      href={shareUrls.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center px-4 py-2 text-sm hover:bg-opacity-80 transition-colors ${
                        darkMode
                          ? "text-slate-300 hover:bg-slate-700"
                          : "text-slate-700 hover:bg-sky-50"
                      }`}
                      onClick={() => setShowShareMenu(false)}
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      Share on LinkedIn
                    </a>
                    <a
                      href={shareUrls.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center px-4 py-2 text-sm hover:bg-opacity-80 transition-colors ${
                        darkMode
                          ? "text-slate-300 hover:bg-slate-700"
                          : "text-slate-700 hover:bg-sky-50"
                      }`}
                      onClick={() => setShowShareMenu(false)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Share on WhatsApp
                    </a>
                    <button
                      onClick={copyLink}
                      className={`w-full text-left flex items-center px-4 py-2 text-sm hover:bg-opacity-80 transition-colors ${
                        darkMode
                          ? "text-slate-300 hover:bg-slate-700"
                          : "text-slate-700 hover:bg-sky-50"
                      }`}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Copy Link
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div
              className={`prose prose-lg max-w-none mb-8 ${
                darkMode
                  ? "prose-invert prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-blockquote:text-slate-300"
                  : "prose-slate"
              }`}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {blog.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <h3
                className={`text-lg font-semibold mb-3 ${
                  darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-3 py-1 text-sm rounded-full transition-colors ${
                      darkMode
                        ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div
              className={`flex items-center justify-between pt-8 border-t ${
                darkMode ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <div
                className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Published on {formatDate(blog.createdAt).split(" at ")[0]}
              </div>

              <div className="flex items-center space-x-4">
                {!user && (
                  <Link
                    to="/signin"
                    className={`text-sm font-medium transition-colors duration-200 ${
                      darkMode
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-sky-600 hover:text-sky-500"
                    }`}
                  >
                    Sign in to bookmark
                  </Link>
                )}

                <Link
                  to="/"
                  className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                    darkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  Read More Articles
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}