import { useState, useEffect, useCallback } from "react";
import { blogService } from "../services/blogServices";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import AOS from "aos";
import "aos/dist/aos.css";
import { startAutoRefresh, stopAutoRefresh } from "../services/refreshTimer";
import { doc, getDoc } from "firebase/firestore";
import Top1 from "./Homepagecomponents/top1";
import Top2 from "./Homepagecomponents/top2";
import Top3 from "./Homepagecomponents/top3";
import Top4 from "./Homepagecomponents/top4";
import Top5 from "./Homepagecomponents/top5";

export default function HomePage({ searchTerm }) {
  const [user] = useAuthState(auth);
  const [blogs, setBlogs] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRefreshStatus = async () => {
      const ref = doc(db, "meta", "refreshStatus");
      const snap = await getDoc(ref);
      if (snap.exists()) {}
    };
    fetchRefreshStatus();
    const interval = setInterval(fetchRefreshStatus, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {}, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 400,
      offset: 50,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [blogs]);

  useEffect(() => {
    const unsubscribe = blogService.getLatestBlogs((newBlogs) => {
      setBlogs(newBlogs);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      const unsubscribe = blogService.getUserBookmarks(user.uid, (b) =>
        setBookmarks(b)
      );
      return unsubscribe;
    }
    setBookmarks([]);
  }, [user]);

  const handleRefresh = useCallback(async () => {
    try {
      await blogService.generateBlogs(1);
      await blogService.cleanupOldBlogs();
    } catch (e) {}
    await new Promise((res) => setTimeout(res, 1000));
  }, []);

  useEffect(() => {
    startAutoRefresh(handleRefresh);
    return stopAutoRefresh;
  }, [handleRefresh]);

  const isBookmarked = useCallback(
    (id) => bookmarks.some((b) => b.blogId === id),
    [bookmarks]
  );

  const handleBookmarkToggle = useCallback(
    async (blogId) => {
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
      } catch (error) {}
    },
    [isBookmarked]
  );

  const handleViewIncrement = useCallback(async (id) => {
    try {
      await blogService.incrementViews(id);
    } catch (e) {}
  }, []);

  return (
  <div className="min-h-screen pb-20 bg-red-20">
    
    {loading ? (
      <div className="flex justify-center py-20">
        <div className="spinner"></div>
      </div>
    ) : (
      <>
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

        <Top3 />
        <Top4 />
        <Top5 blogs={blogs} />
      </>
    )}
  </div>
  );

}
