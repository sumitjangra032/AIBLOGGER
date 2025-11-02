import {useState,useEffect,useCallback} from "react";
import {Filter,ChevronDown} from "lucide-react";
import {BLOG_CATEGORIES} from "../types/blog";
import {blogService} from "../services/blogServices";
import BlogCard from "./BlogCard";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../firebase";
import HeroCarousel from "./HeroSection";
import AOS from "aos";
import "aos/dist/aos.css";
import { startAutoRefresh,stopAutoRefresh } from "../services/refreshTimer";
import { doc, getDoc } from "firebase/firestore";

export default function HomePage({searchTerm}){
  const [user] = useAuthState(auth);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const darkMode = false;

  useEffect(() => {
    const fetchRefreshStatus = async () => {
      const ref = doc(db, "meta", "refreshStatus");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setLastRefresh(data.lastRefresh.toDate());
      }
    };
    fetchRefreshStatus();
    const interval = setInterval(fetchRefreshStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 400,
      offset: 50,
      easing: "ease-in-out",
      once: false
    });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [filteredBlogs]);

  useEffect(() => {
    const unsubscribe = blogService.getLatestBlogs((newBlogs) => {
      setBlogs(newBlogs);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = blogService.getUserBookmarks(
        user.uid,
        (userBookmarks) => {
          setBookmarks(userBookmarks);
        }
      );
      return unsubscribe;
    } else {
      setBookmarks([]);
    }
  }, [user]);

  useEffect(() => {
    let filtered = blogs;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((blog) => blog.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(term) ||
          blog.content.toLowerCase().includes(term) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(term)) ||
          blog.author.toLowerCase().includes(term)
      );
    }

    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, selectedCategory]);

  const handleRefresh = async () => {
    try {
      await blogService.generateBlogs(1);
      await blogService.cleanupOldBlogs();
    } catch (error) {}
    await new Promise((res) => setTimeout(res, 1000));
  };

  useEffect(() => {
    startAutoRefresh(handleRefresh, setLastRefresh);
    return () => stopAutoRefresh();
  }, []);

  const handleBookmarkToggle = async (blogId) => {
    if (!user) return;
    const isBookmarked = bookmarks.some(
      (bookmark) => bookmark.blogId === blogId
    );
    try {
      if (isBookmarked) {
        await blogService.removeBookmark(user.uid, blogId);
      } else {
        await blogService.addBookmark(user.uid, blogId);
      }
    } catch (error) {}
  };

  const handleViewIncrement = useCallback(async (blogId) => {
    try {
      await blogService.incrementViews(blogId);
    } catch (error) {}
  }, []);

  const isBookmarked = (blogId) => {
    return bookmarks.some((bookmark) => bookmark.blogId === blogId);
  };

  const formatLastRefresh = () => {
    if (!lastRefresh) return "Loading...";
    const diff = currentTime.getTime() - lastRefresh.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-gradient-to-br from-sky-50 to-blue-100"}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${darkMode ? "border-blue-400" : "border-sky-500"}`}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 pb-20 ${darkMode ? "bg-slate-900" : "bg-gradient-to-br from-sky-50 to-blue-100"}`}>
      <div className="w-full mb-6">
        <HeroCarousel />
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-4 sm:py-6">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="w-full md:w-auto flex items-center justify-between md:justify-start gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                darkMode
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  : "bg-white hover:bg-sky-50 text-slate-700 shadow-sm border border-sky-200"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Last updated: {formatLastRefresh()}
            </span>
          </div>
        </div>

        {showFilters && (
          <div
            className={`flex overflow-x-auto gap-2 p-3 rounded-lg mb-6 ${
              darkMode
                ? "bg-slate-800"
                : "bg-white shadow-sm border border-sky-200"
            }`}
          >
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 text-sm whitespace-nowrap rounded-full transition-colors ${
                selectedCategory === "all"
                  ? darkMode
                    ? "bg-blue-600 text-white"
                    : "bg-sky-500 text-white"
                  : darkMode
                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </button>
            {BLOG_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 text-sm whitespace-nowrap rounded-full transition-colors ${
                  selectedCategory === category
                    ? darkMode
                      ? "bg-blue-600 text-white"
                      : "bg-sky-500 text-white"
                    : darkMode
                      ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {searchTerm && (
          <div className={`mb-6 text-center ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
            Found {filteredBlogs.length} result
            {filteredBlogs.length !== 1 ? "s" : ""} for "{searchTerm}"
          </div>
        )}

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16">
            <div className={`text-6xl mb-4 ${darkMode ? "text-slate-600" : "text-slate-300"}`}>
              📝
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
              No blogs found
            </h3>
            <p className={`${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {searchTerm
                ? "Try adjusting your search terms or filters"
                : "Check back soon for fresh content!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                data-aos="fade-up"
                data-aos-delay="80"
                data-aos-duration="400"
              >
                <BlogCard
                  blog={blog}
                  isBookmarked={isBookmarked(blog.id)}
                  onBookmarkToggle={handleBookmarkToggle}
                  onViewIncrement={handleViewIncrement}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
