import {useState,useEffect,useCallback} from "react";
// import {Filter,RefreshCw,ChevronDown} from "lucide-react";
import {Filter,ChevronDown} from "lucide-react";
import {BLOG_CATEGORIES} from "../types/blog";
import {blogService} from "../services/blogServices";
import BlogCard from "./BlogCard";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../firebase";
import HeroCarousel from "./HeroSection";
import AOS from "aos";
import "aos/dist/aos.css";
import { startAutoRefresh,stopAutoRefresh } from "../services/refreshTimer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; 


export default function HomePage({searchTerm}){
    
    const [user] = useAuthState(auth);
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    // const [, setRefreshing] = useState(false);
    const [lastRefresh, setLastRefresh] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());
    const darkMode  = false;

    useEffect(() => {
      const fetchRefreshStatus = async () => {
        const ref = doc(db, "meta", "refreshStatus");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setLastRefresh(data.lastRefresh.toDate());
        }
      }

      fetchRefreshStatus();

      const interval = setInterval(fetchRefreshStatus, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }, []);
      

    useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, [])

    useEffect(() => {
    AOS.init({
      duration: 400,
      offset: 50,
      easing: "ease-in-out",
      // anchorPlacement: "center-center",
      once: false,
      });
    }, []);

    useEffect(() => {
      AOS.refresh(); // re-initialize after data changes
    }, [filteredBlogs]);


    // Load initial blogs
    useEffect(() => {
        const unsubscribe = blogService.getLatestBlogs((newBlogs) => {
        setBlogs(newBlogs);
        setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Load user bookmarks
    useEffect(() => {
        if (user) {
        const unsubscribe = blogService.getUserBookmarks(
            user.uid,
            (userBookmarks) => {
            setBookmarks(userBookmarks);
            },
        );
        return unsubscribe;
        } else {
        setBookmarks([]);
        }
    }, [user]);

     // Filter blogs based on search term and category
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
            blog.author.toLowerCase().includes(term),
        );
        }

        setFilteredBlogs(filtered);
    }, [blogs, searchTerm, selectedCategory]);


     const handleRefresh = async () => {
      console.log("🔄 handleRefresh() called!");
      try { 
        await blogService.generateBlogs(1);
        await blogService.cleanupOldBlogs();

        console.log("✅ Blogs refreshed successfully.");

        } catch (error) {
          console.error("Error refreshing blogs:", error);
        } 
        await new Promise((res) => setTimeout(res, 1000));
      };

      useEffect(() => {
        startAutoRefresh(handleRefresh, setLastRefresh);

        return () => stopAutoRefresh();
      }, []);

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

    if (loading) 
    {
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
      className={`min-h-screen transition-colors duration-200 pb-20 ${
        darkMode ? "bg-slate-900" : "bg-gradient-to-br from-sky-50 to-blue-100"
      }`}
    >
      <div className="w-full h-100 mb-8">
      <HeroCarousel />
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          {/* Filter Controls */}
          <div className="flex items-center space-x-4">
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
              <ChevronDown
                className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            {showFilters && (
              <div
                className={`flex flex-wrap gap-2 p-4 rounded-lg ${
                  darkMode
                    ? "bg-slate-800"
                    : "bg-white shadow-sm border border-sky-200"
                }`}
              >
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
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
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
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
          </div>

          {/* Refresh and Stats */}
          <div className="flex items-center space-x-4">
            <span
              className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              Last updated: {formatLastRefresh()}
            </span>
            {/* <button
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-700"
                  : "bg-sky-500 hover:bg-sky-600 text-white disabled:bg-slate-300"
              }`}
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button> */}
          </div>
        </div>

        {/* Results Info */}
        {searchTerm && (
          <div
            className={`mb-6 text-center ${darkMode ? "text-slate-300" : "text-slate-600"}`}
          >
            Found {filteredBlogs.length} result
            {filteredBlogs.length !== 1 ? "s" : ""} for "{searchTerm}"
          </div>
        )}

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
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
              No blogs found
            </h3>
            <p className={`${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {searchTerm
                ? "Try adjusting your search terms or filters"
                : "Check back soon for fresh content!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                data-aos="fade-up"
                // data-aos-offset="-100"
                // data-aos-anchor-placement="center-center"
                data-aos-delay="80"
                data-aos-duration="400"
                
              >
              <BlogCard
                key={blog.id}
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