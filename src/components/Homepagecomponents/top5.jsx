import React, { useEffect, useState, useMemo, useCallback } from "react";
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import AutoSquareSlider from "../Boxslidecorousel";

const FALLBACK_IMAGE = "https://picsum.photos/seed/fallback/800/600";

export default function Top5({ blogs }) {
  const [trending, setTrending] = useState([]);

  const recommended = useMemo(() => {
    if (!blogs?.length) return [];
    return blogs.slice(50, 55);
  }, [blogs]);

  const formatDate = useCallback((ts) => {
    if (!ts) return "Recently";
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    if (isNaN(d.getTime())) return "Recently";
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "long" });
    const monthCap = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();
    const year = d.getFullYear();
    return `${day} ${monthCap}, ${year}`;
  }, []);

  const getStartOfWeek = useCallback(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchTrending = async () => {
      try {
        const weekStartTS = Timestamp.fromDate(getStartOfWeek());
        const q = query(
          collection(db, "blogs"),
          where("createdAt", ">=", weekStartTS),
          orderBy("createdAt", "desc"),
          limit(8)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (!cancelled) setTrending(data);
      } catch (err) {
        console.error("Error fetching trending posts:", err);
      }
    };
    fetchTrending();
    return () => {
      cancelled = true;
    };
  }, [getStartOfWeek]);

  const weeklyPosts = useMemo(() => trending.slice(0, 4), [trending]);

  return (
    <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 px-3">
      <div className="lg:col-span-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-red-500 pb-1">
            Weekly Best Articles
          </h2>
          <Link
            to="/history"
            className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center border border-red-500 px-4 py-2 rounded-sm transition-colors hover:bg-red-50"
          >
            VIEW ALL
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="mt-7 space-y-6">
          {weeklyPosts.map((post) => {
            const title = post?.title ?? "";
            const excerpt = (post?.excerpt ?? "")
              .replace(/^\s*(?:#+\s*)?(?:introduction\b[\s:—-]*)/i, "")
              .replace(/#/g, "")
              .trim();
            const imageSrc = post?.imageUrl || FALLBACK_IMAGE;
            return (
              <div
                key={post?.id}
                className="flex flex-row items-stretch gap-4 border-b border-gray-300 pb-4"
                style={{ alignItems: "flex-start" }}
              >
                <div className="flex-1 min-w-[240px] max-w-[820px]">
                  <span className="inline-block text-xs text-white font-semibold px-3 py-1 rounded-md bg-[#EB5757] uppercase mb-3 shadow shadow-red-500">
                    {post?.category || "NEWS"}
                  </span>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {title.length > 60 ? title.substring(0, 60) + "..." : title}
                  </h3>

                  <div className="flex flex-wrap items-center text-sm text-gray-900 mt-3">
                    <span>By {post?.author || "Admin"}</span>
                    <Calendar className="ml-2 w-4 h-4 mr-2" />
                    <span>{formatDate(post?.createdAt)}</span>
                    <span className="ml-2">{post?.views || 0} Views</span>
                  </div>

                  <p className="text-gray-700 mt-3 mb-6 text-sm leading-relaxed">{excerpt}</p>

                  <div>
                    <Link
                      to={`/blog/${post?.slug || post?.id}`}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold shadow shadow-red-500 px-4 py-2 rounded-sm transition-colors hover:bg-red-50"
                    >
                      READ MORE
                    </Link>
                  </div>
                </div>

                <div className="w-[40%] max-w-[360px] min-w-[140px] overflow-hidden rounded-md group" style={{ flexShrink: 0 }}>
                  <img
                    src={imageSrc}
                    alt={post?.title || "post image"}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover rounded-md transition-transform duration-300 ease-out group-hover:scale-105"
                    style={{ height: "100%", maxHeight: 260 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="w-full h-[350px]">
          <AutoSquareSlider />
        </div>

        <div className="mt-7">
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-red-500 inline-block pb-1 pt-3 mb-2">
            Recommended
          </h2>

          <div className="space-y-3">
            {recommended.map((post) => {
              const title = post?.title ?? "";
              const imageSrc = post?.imageUrl || FALLBACK_IMAGE;
              return (
                <div key={post?.id} className="hover:bg-red-50 p-1 rounded-md">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-2">
                    <div className="overflow-hidden rounded-md group aspect-[4/3]">
                      <img
                        src={imageSrc}
                        alt={post?.title || "thumb"}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_IMAGE;
                        }}
                        className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="lg:col-span-2 border-b border-gray-300 pb-2">
                      <span className="inline-block text-xs text-white font-semibold px-3 py-1 rounded-md bg-[#EB5757] uppercase mb-2 shadow shadow-red-500">
                        {post?.category || "NEWS"}
                      </span>

                      <Link
                        to={`/blog/${post?.slug || post?.id}`}
                        className="flex flex-wrap text-sm font-bold text-gray-900 hover:text-red-500 transition-colors"
                      >
                        {title.length > 60 ? title.substring(0, 60) + "..." : title}
                      </Link>

                      <div className="flex flex-wrap items-center text-sm text-gray-900 mt-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{formatDate(post?.createdAt)}</span>
                        <span className="ml-2">{post?.views || 0} Views</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
