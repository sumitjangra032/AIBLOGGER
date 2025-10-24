
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Cloud, User, Bookmark } from "lucide-react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";


export default function Header({ onSearch, searchTerm }){
  const darkMode = false;
  const [user] = useAuthState(auth);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowUserMenu(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 ${
        darkMode
          ? "bg-slate-900/95 border-slate-700"
          : "bg-sky-50/95 border-sky-200"
      } backdrop-blur-md border-b transition-colors duration-200`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Cloud
              className={`w-8 h-8 ${darkMode ? "text-blue-400" : "text-sky-500"}`}
            />
            <h1
              className={`text-2xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}
            >
              StoryMint
            </h1>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  darkMode ? "text-slate-400" : "text-slate-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search blogs by title, tags, or keywords..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-full border transition-colors duration-200 ${
                  darkMode
                    ? "bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400"
                    : "bg-white border-sky-200 text-slate-800 placeholder-slate-500 focus:border-sky-400"
                } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  darkMode ? "focus:ring-blue-400" : "focus:ring-sky-400"
                }`}
              />
            </div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors duration-200 ${
                darkMode
                  ? "bg-slate-700 hover:bg-slate-600 text-yellow-400"
                  : "bg-sky-100 hover:bg-sky-200 text-slate-600"
              }`}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button> */}

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`font-medium hover:text-opacity-80 transition-colors ${
                  darkMode
                    ? "text-slate-300 hover:text-blue-400"
                    : "text-slate-700 hover:text-sky-500"
                }`}
              >
                Home
              </Link>
              <Link
                to="/history"
                className={`font-medium hover:text-opacity-80 transition-colors ${
                  darkMode
                    ? "text-slate-300 hover:text-blue-400"
                    : "text-slate-700 hover:text-sky-500"
                }`}
              >
                History
              </Link>
            </nav>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center space-x-2 p-2 rounded-full transition-colors duration-200 ${
                    darkMode
                      ? "bg-slate-700 hover:bg-slate-600"
                      : "bg-sky-100 hover:bg-sky-200"
                  }`}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <User
                      className={`w-5 h-5 ${darkMode ? "text-slate-300" : "text-slate-600"}`}
                    />
                  )}
                </button>

                {showUserMenu && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border ${
                      darkMode
                        ? "bg-slate-800 border-slate-600"
                        : "bg-white border-sky-200"
                    } py-2`}
                  >
                    <Link
                      to="/bookmarks"
                      onClick={() => setShowUserMenu(false)}
                      className={`flex items-center px-4 py-2 text-sm hover:bg-opacity-80 transition-colors ${
                        darkMode
                          ? "text-slate-300 hover:bg-slate-700"
                          : "text-slate-700 hover:bg-sky-50"
                      }`}
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      My Bookmarks
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-opacity-80 transition-colors ${
                        darkMode
                          ? "text-slate-300 hover:bg-slate-700"
                          : "text-slate-700 hover:bg-sky-50"
                      }`}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-sky-500 hover:bg-sky-600 text-white"
                }`}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}


