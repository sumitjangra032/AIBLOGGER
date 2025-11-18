import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Cloud, User, X } from "lucide-react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useStore } from "../services/store";
import HamburgerMenu from "./HamburgerMenu";

export default function Header({ onSearch, searchTerm }) {
  const [user] = useAuthState(auth);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  useStore();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      setShowUserMenu(false);
    } catch (e) {}
  }, []);

  const handleSearchToggle = useCallback(() => {
    setShowMobileSearch((prev) => !prev);
  }, []);

  const handleSearchChange = useCallback(
    (e) => {
      onSearch(e.target.value);
    },
    [onSearch]
  );

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
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-orange-500 rounded-full"
          style={{ width: `${scrollWidth}%`, transition: "width 0.2s ease-out" }}
        />

        <div className="flex items-center justify-between w-full px-20 gap-5">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <Cloud className="w-6 h-6 text-red-500" />
              <h1 className="text-xl font-bold text-gray-800">StoryMint</h1>
            </Link>
          </div>

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

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu((prev) => !prev)}
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
                className="hidden md:block bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
            )}

            <div className="flex items-center space-x-2 md:hidden">
              <div className="relative">
                {!showMobileSearch && (
                  <button
                    onClick={handleSearchToggle}
                    className="p-2 rounded-full hover:bg-orange-50 transition-colors duration-200 group"
                  >
                    <Search className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                  </button>
                )}

                {showMobileSearch && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full shadow-lg animate-slide-in">
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

              <HamburgerMenu />
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes slide-in {
            from { opacity: 0; transform: translateY(-10px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-slide-in { animation: slide-in 0.2s ease-out forwards; }
        `}
      </style>
    </header>
  );
}
