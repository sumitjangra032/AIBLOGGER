import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Cloud, User, X } from "lucide-react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useStore } from "../services/store";
import HamburgerMenu from "./HamburgerMenu";
// import MobileSearch from "./MobilSearch";

export default function Header({ onSearch, searchTerm }) {
  // const darkMode = false;
  const [user] = useAuthState(auth);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const { isSearchDisabled } = useStore();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowUserMenu(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSearchToggle = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollWidth(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-md transition-colors duration-200 shadow-xl">
      <div className="container mx-auto px-4 py-3">
        {/* Progress Bar */}
        <div 
          className="absolute bottom-0 left-0 h-0.5 bg-orange-500 rounded-full"
          style={{ width: `${scrollWidth}%`, transition: "width 0.2s ease-out" }} 
        />
        
        <div className="flex items-center justify-between w-full px-20 gap-5">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Cloud className="w-6 h-6 text-orange-500" />
              <h1 className="text-xl font-bold text-gray-800">StoryMint</h1>
            </Link>
          </div>

          {/* Navigation Links - Centered */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/bookmarks"
              className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
            >
              Bookmarks
            </Link>
            <Link
              to="/history"
              className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
            >
              History
            </Link>
            <Link
              to="/AboutUs"
              className="text-sm font-medium text-gray-700 hover:text-orange-600 transition-colors"
            >
              About Us
            </Link>
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Search - Desktop */}
            <div className="hidden md:flex items-center">
              {/* Search Icon */}
              {!showMobileSearch && (
                <button 
                  onClick={handleSearchToggle}
                  className="p-2 rounded-full hover:bg-orange-50 transition-colors duration-200 group"
                >
                  <Search className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                </button>
              )}
              
              {/* Search Bar when expanded */}
              {showMobileSearch && (
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search blogs by title, tags, or keywords..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      autoFocus
                    />
                    {isSearchDisabled && <div className="search-blocker"></div>}
                  </div>
                  <button 
                    onClick={handleSearchToggle}
                    className="p-2 rounded-full hover:bg-orange-50 transition-colors duration-200"
                  >
                    <X className="w-5 h-5 text-gray-600 hover:text-orange-600 transition-colors" />
                  </button>
                </div>
              )}
            </div>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 p-1 rounded-full transition-colors duration-200 hover:bg-orange-50"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-600 hover:text-orange-600 transition-colors" />
                  )}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border border-gray-200 bg-white py-2 z-50">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="hidden md:block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Controls */}
            <div className="flex items-center space-x-2 md:hidden">
              {/* Mobile Search Icon with Animation */}
              <div className="relative">
                {/* Search Icon */}
                {!showMobileSearch && (
                  <button 
                    onClick={handleSearchToggle}
                    className="p-2 rounded-full hover:bg-orange-50 transition-colors duration-200 group"
                  >
                    <Search className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                  </button>
                )}
                
                {/* Mobile Search Bar when expanded */}
                {showMobileSearch && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-lg animate-slide-in">
                    <div className="flex items-center px-3 py-2">
                      <Search className="w-4 h-4 text-gray-400 mr-2" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 w-32 sm:w-40"
                        autoFocus
                      />
                      <button 
                        onClick={handleSearchToggle}
                        className="ml-2 p-1 rounded-full hover:bg-orange-50 transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-600 hover:text-orange-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Hamburger Menu */}
              <HamburgerMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for animations */}
      {/* <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.2s ease-out forwards;
        }
      `}</style> */}
    </header>
  );
}