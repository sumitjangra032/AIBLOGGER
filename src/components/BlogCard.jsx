// components/BlogCard.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  BookmarkCheck,
  Share,
  Eye,
  Calendar,
  Tag,
  ExternalLink,
  Twitter,
  Linkedin,
  MessageCircle,
} from "lucide-react";
// import { useTheme } from "../contexts/ThemeContext";
// import { Blog } from "../types/blog";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";


export default function BlogCard({
  blog,
  isBookmarked,
  onBookmarkToggle,
  onViewIncrement,
}){
  const { darkMode } = false;
  const [user] = useAuthState(auth);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      onBookmarkToggle(blog.id);
    } else {
      // Redirect to sign in
      window.location.href = "/signin";
    }
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.origin + "/blog/" + blog.id)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + "/blog/" + blog.id)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(blog.title + " - " + window.location.origin + "/blog/" + blog.id)}`,
  };

  const copyLink = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(
        window.location.origin + "/blog/" + blog.id,
      );
      // You could add a toast notification here
      setShowShareMenu(false);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <article
      className={`h-full group bg-white relative overflow-hidden rounded-2xl 
        transition-all duration-300 
        shadow-md 
        hover:-translate-y-1 
        hover:shadow-lift-glow${
        darkMode
          ? "bg-slate-800 border border-slate-700"
          : "bg-white border border-sky-100"
      }`}
    >
      {/* Image */}
      {blog.imageUrl && (
        
          <div className="image-anime aspect-video overflow-hidden">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-58 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category and Date */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${
              darkMode ? "bg-blue-900 text-blue-200" : "bg-slate-200 text-sky-700"
            }`}
          >
            {blog.category}
          </span>
          <div
            className={`flex items-center text-xs ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            <Calendar className="w-3 h-3 mr-1" />
            {formatDate(blog.createdAt)}
          </div>
        </div>

        {/* Title */}
        <Link
          to={`/blog/${blog.id}`}
          onClick={() => onViewIncrement(blog.id)}
          className="block"
        >
          <h2
            className={`text-xl font-bold mb-3 line-clamp-2 group-hover:text-opacity-80 transition-colors ${
              darkMode
                ? "text-white hover:text-blue-400"
                : "text-slate-900 hover:text-sky-600"
            }`}
          >
            {blog.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p
          className={`text-sm mb-4 line-clamp-3 ${
            darkMode ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {blog.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-2 py-1 text-xs rounded-lg ${
                darkMode
                  ? "bg-slate-700 text-slate-300"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-opacity-20 border-slate-300">
          {/* Author and Views */}
          <div className="flex items-center space-x-4">
            <span
              className={`text-sm font-medium ${
                darkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              <div className="pie-wrap flex items-center space-x-2">
                <div className="profile-img">
                  <img
                    src={`/author_images/${blog.author}.jpg`}
                    alt={blog.author}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  By {blog.author}
                </p>
                </div>
            </span>
            <div
              className={`flex items-center text-xs ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              <Eye className="w-3 h-3 mr-1" />
              {blog.views || 0}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 relative">
            {/* Bookmark Button */}
            <button
              onClick={handleBookmarkClick}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isBookmarked
                  ? darkMode
                    ? "bg-yellow-600 text-yellow-100"
                    : "bg-yellow-500 text-white"
                  : darkMode
                    ? "hover:bg-slate-700 text-slate-400 hover:text-yellow-400"
                    : "hover:bg-slate-100 text-slate-600 hover:text-yellow-600"
              }`}
              title={
                user
                  ? isBookmarked
                    ? "Remove bookmark"
                    : "Add bookmark"
                  : "Sign in to bookmark"
              }
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {/* Share Button */}
            <button
              onClick={handleShareClick}
              className={`p-2 rounded-full transition-colors duration-200 ${
                darkMode
                  ? "hover:bg-slate-700 text-slate-400 hover:text-blue-400"
                  : "hover:bg-slate-100 text-slate-600 hover:text-sky-600"
              }`}
              title="Share blog"
            >
              <Share className="w-4 h-4" />
            </button>

            {/* Share Menu */}
            {showShareMenu && (
              <div
                className={`absolute right-0 bottom-full mb-2 w-48 rounded-lg shadow-lg border ${
                  darkMode
                    ? "bg-slate-800 border-slate-600"
                    : "bg-white border-sky-200"
                } py-2 z-10`}
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
      </div>
    </article>
  );
}


