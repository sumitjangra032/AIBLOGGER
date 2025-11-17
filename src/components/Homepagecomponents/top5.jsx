import { useEffect, useState, useMemo } from "react";
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import React from "react";
import AutoSquareSlider from "../Boxslidecorousel";

export default function Top5({ blogs }) {
  const [trending, setTrending] = useState([]);
  const [randomIndex, setRandomIndex] = useState(null);

  useEffect(() => {
    if (!blogs?.length) return;

    const saved = localStorage.getItem("top1_random_index");
    const savedIndex = saved !== null ? parseInt(saved) : null;

    if (savedIndex !== null && savedIndex < blogs.length) {
      setRandomIndex(savedIndex);
    } else {
      const idx = Math.floor(Math.random() * blogs.length);
      localStorage.setItem("top1_random_index", String(idx));
      setRandomIndex(idx);
    }
  }, [blogs]);

  const recommended = useMemo(() => {
    if (randomIndex === null || !blogs?.length) return [];

    const start = randomIndex + 20;
    const end = start + 7;

    return blogs.slice(start, end);
  }, [blogs, randomIndex]);

  const formatDate = (ts) => {
    if (!ts) return "Recently";
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    if (isNaN(d.getTime())) return "Recently";

    const day = d.getDate();
    let month = d.toLocaleString("en-US", { month: "long" });
    month = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  useEffect(() => {
    const fetchTrending = async () => {
      const weekStart = getStartOfWeek();
      const weekStartTS = Timestamp.fromDate(weekStart);

      const q = query(
        collection(db, "blogs"),
        where("createdAt", ">=", weekStartTS),
        orderBy("createdAt", "desc"),
        limit(8)
      );

      try {
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrending(data);
      } catch (error) {
        console.error("Error fetching trending posts:", error);
      }
    };

    fetchTrending();
  }, []);

  const weeklyPosts = trending.slice(0, 4);

  return (
    <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
      <div className="lg:col-span-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-red-500 pb-1">
            Weekly Best Articles
          </h2>
          <Link
            to="/history"
            className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center shadow shadow-red-500 px-4 py-2 rounded-md transition-colors hover:bg-red-50"
          >
            VIEW ALL
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-7">
          {weeklyPosts.map((post) => (
            <React.Fragment key={post?.id}>
              <div className="lg:col-span-1 max-h-[260px] border-b border-gray-300 ">
                <span className="inline-block text-xs text-white font-semibold px-3 py-1 rounded-md bg-[#EB5757] uppercase mb-3 shadow shadow-red-500">
                  {post?.category || "NEWS"}
                </span>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {post?.title?.length > 60 ? post.title.substring(0, 60) + "..." : post.title}
                </h3>

                <div className="flex flex-wrap items-center text-sm text-gray-900 mt-3">
                  <span>By {post?.author || "Admin"}</span>
                  <Calendar className="ml-2 w-4 h-4 mr-2" />
                  <span>{formatDate(post?.createdAt)}</span>
                  <span className="ml-2">{post?.views || 0} Views</span>
                </div>

                <p className="text-gray-700 mt-3 mb-6 text-sm leading-relaxed">
                  {(post?.excerpt ?? "")
                    .replace(/^\s*(?:#+\s*)?(?:introduction\b[\s:—-]*)/i, "")
                    .replace(/#/g, "")
                    .trim()}
                </p>

                <div>
                  <Link
                    to={`/blog/${post?.slug || post?.id}`}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold shadow shadow-red-500 px-4 py-2 rounded-sm transition-colors hover:bg-red-50"
                  >
                    READ MORE
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-1 overflow-hidden rounded-md group aspect-[4/3] w-full max-h-[260px]">
                <img
                  src={post?.imageUrl}
                  alt={post?.title}
                  className="w-full h-full object-cover overflow-hidden rounded-md transition-transform duration-300 ease-out group-hover:scale-105"
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="w-full h-[350px]">
          <AutoSquareSlider />
        </div>

        <div className="mt-9">
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-red-500 inline-block pb-1 pt-3 mb-2">
            Recommended
          </h2>

          {recommended.map((post) => (
            <div key={post?.id}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 mt-2 space-y-2 hover:bg-gray-200">
                <div className="lg:col-span-1 overflow-hidden rounded-md group aspect-[4/3]">
                  <img
                    src={post?.imageUrl}
                    alt={post?.title}
                    className="w-full h-full object-cover overflow-hidden rounded-md transition-transform duration-300 ease-out group-hover:scale-105"
                  />
                </div>

                <div className="lg:col-span-2 border-b border-gray-300">
                  <span className="inline-block text-xs text-white font-semibold px-3 py-1 rounded-md bg-[#EB5757] uppercase mb-2 shadow shadow-red-500">
                    {post?.category || "NEWS"}
                  </span>

                  <Link
                    to={`/blog/${post?.slug || post.id}`}
                    className="flex flex-wrap text-sm font-bold text-gray-900 hover:text-red-500 transition-colors"
                  >
                    {post?.title?.length > 60 ? post.title.substring(0, 60) + "..." : post.title}
                  </Link>

                  <div className="flex flex-wrap items-center text-sm text-gray-900 mt-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(post?.createdAt)}</span>
                    <span className="ml-2">{post?.views || 0} views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
