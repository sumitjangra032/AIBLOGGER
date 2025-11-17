import {useState,useEffect,useCallback} from "react";
import {Filter,ChevronDown} from "lucide-react";
import {BLOG_CATEGORIES} from "../types/blog";
import {blogService} from "../services/blogServices";
import BlogCard from "./BlogCard";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../firebase";
// import HeroCarousel from "./HeroSection";
import AOS from "aos";
import "aos/dist/aos.css";
import { startAutoRefresh,stopAutoRefresh } from "../services/refreshTimer";
import { doc, getDoc } from "firebase/firestore";
import Top1 from "./Homepagecomponents/top1";
import Top2 from "./Homepagecomponents/top2";
import Top3 from "./Homepagecomponents/top3";
import Top4 from "./Homepagecomponents/top4";
import Top5 from "./Homepagecomponents/top5";



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
      setLoading(false); // This sets loading to false when blogs are loaded
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

  const isBookmarked = (blogId) => {
    return bookmarks.some((bookmark) => bookmark.blogId === blogId);
  };

  const handleBookmarkToggle = async (blogId) => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    window.location.href = "/signin";
    return;
  }

  const uid = currentUser.uid;
  const idStr = String(blogId);

  try {
    if (isBookmarked(blogId)) {
      await blogService.removeBookmark(uid, idStr);
    } else {
      await blogService.addBookmark(uid, idStr);
    }
  } catch (error) {
    console.error("Bookmark toggle failed:", error);
  }
 };

  const handleViewIncrement = useCallback(async (blogId) => {
    try {
      await blogService.incrementViews(blogId);
    } catch (error) {}
  }, []);

  return (
    <div className={`min-h-screen  pb-20 ${darkMode ? "bg-slate-900" : "bg-white"}`}>
      <Top1 
        blogs={blogs}
        onBookmarkToggle={handleBookmarkToggle}
        onViewIncrement={handleViewIncrement} 
        loading={loading} 
        isBookmarked={isBookmarked}
      />
      <Top2 
        blogs={blogs}
        onBookmarkToggle={handleBookmarkToggle}
        onViewIncrement={handleViewIncrement} 
        loading={loading} 
        isBookmarked={isBookmarked}
      />
      {/* <Top3 /> */}
      <Top3 />
      <Top4 />
      <Top5 blogs={blogs}/>

    </div>
  );
}