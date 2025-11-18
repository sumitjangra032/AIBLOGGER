import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { Calendar, Eye, Bookmark, BookmarkCheck } from "lucide-react";
import { auth } from "../../firebase";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import HeroCarousel from "../HeroSection";

export default function Top1({ blogs = [], onBookmarkToggle, onViewIncrement, loading, isBookmarked }) {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [typingTitle, setTypingTitle] = useState("");
  const typingIndexRef = useRef(0);
  const typingIntervalRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const [randomIndex, setRandomIndex] = useState(null);

  useEffect(() => {
    if (!blogs?.length) return;

    try {
      const savedRaw = localStorage.getItem("top1_random_index");
      const saved = savedRaw === null ? null : parseInt(savedRaw, 10);
      if (saved !== null && Number.isInteger(saved) && saved >= 0 && saved < blogs.length) {
        setRandomIndex(saved);
      } else {
        const idx = Math.floor(Math.random() * blogs.length);
        localStorage.setItem("top1_random_index", idx.toString());
        setRandomIndex(idx);
      }
    } catch {
      const idx = Math.floor(Math.random() * blogs.length);
      try { localStorage.setItem("top1_random_index", idx.toString()); } catch {}
      setRandomIndex(idx);
    }
  }, [blogs]);

  const main = useMemo(() => {
    if (randomIndex === null) return null;
    return blogs[randomIndex];
  }, [blogs, randomIndex]);

  const getRightBlogs = useCallback((list, startIndex, count = 3) => {
    if (!Array.isArray(list) || startIndex === null) return [];
    const res = [];
    for (let i = 1; i <= count; i++) {
      const idx = startIndex + i;
      if (idx < list.length) res.push(list[idx]);
      else if (idx >= list.length) {
        const wrapIdx = idx - list.length;
        if (wrapIdx < list.length) res.push(list[wrapIdx]);
      }
    }
    return res.slice(0, count);
  }, []);

  const rightBlogs = useMemo(() => {
    if (randomIndex === null) return [];
    return getRightBlogs(blogs, randomIndex, 3);
  }, [blogs, randomIndex, getRightBlogs]);

  const formatDate = useCallback((timestamp) => {
    if (!timestamp) return "Recently";
    try {
      const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(d.getTime())) return "Recently";
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  }, []);

  const TYPING_SPEED = 60;
  const RESTART_DELAY = 50000;

  useEffect(() => {
    if (!main || loading) return;

    const title = main.title || "";
    let i = 0;

    const startTyping = () => {
      clearInterval(typingIntervalRef.current);
      clearTimeout(restartTimeoutRef.current);

      setTypingTitle("");
      typingIndexRef.current = 0;
      setIsTypingComplete(false);

      i = 0;
      typingIntervalRef.current = setInterval(() => {
        i += 1;
        typingIndexRef.current = i;
        setTypingTitle(title.slice(0, i));
        if (i >= title.length) {
          setIsTypingComplete(true);
          clearInterval(typingIntervalRef.current);
        }
      }, TYPING_SPEED);
    };

    startTyping();

    restartTimeoutRef.current = setTimeout(() => {
      startTyping();
    }, RESTART_DELAY);

    return () => {
      clearInterval(typingIntervalRef.current);
      clearTimeout(restartTimeoutRef.current);
    };
  }, [main, loading, TYPING_SPEED]);

  useEffect(() => {
    return () => {
      clearInterval(typingIntervalRef.current);
      clearTimeout(restartTimeoutRef.current);
    };
  }, []);

  const handleBookmark = useCallback(
    (e, id) => {
      e.preventDefault();
      e.stopPropagation();
      if (user) {
        onBookmarkToggle && onBookmarkToggle(id);
      } else {
        navigate("/signin");
      }
    },
    [user, onBookmarkToggle, navigate]
  );

  const handleViewIncrement = useCallback(
    (idOrSlug) => {
      onViewIncrement && onViewIncrement(idOrSlug);
    },
    [onViewIncrement]
  );

  if (loading) {
    return <Top1Skeleton />;
  }

  if (!blogs || blogs.length === 0) return null;
  if (!main) return null;

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 md:px-3 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Link
          to={`/blog/${main.slug || main.id}`}
          onClick={() => handleViewIncrement(main.slug || main.id)}
          className="relative overflow-hidden group col-span-2 rounded-md block"
          aria-label={`Open article ${main.title}`}
        >
          <div className="w-full h-64 sm:h-80 md:h-[420px] lg:h-[500px] relative overflow-hidden rounded-md">
            <img
              src={main.imageUrl}
              alt={main.title || "Article image"}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-md"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <span className="px-3 py-1 text-xs font-semibold rounded bg-[#EB5757] shadow shadow-red-500 inline-block">
                {main.category}
              </span>

              <h2 className="text-xl sm:text-2xl md:text-2xl font-semibold mt-3 line-clamp-2 min-h-[3.5rem] group-hover:text-red-600">
                {typingTitle || main.title}
                {!isTypingComplete && typingTitle.length < (main.title || "").length && (
                  <span className="inline-block w-1 h-6 bg-white ml-1 animate-pulse" aria-hidden="true" />
                )}
              </h2>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-200 mt-3">
                <div className="flex items-center space-x-2">
                  <img
                    src={`/author_images/${main.author}.jpg`}
                    alt={main.author || "Author"}
                    className="w-8 h-8 rounded-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <p className="text-sm">By {main.author}</p>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span className="text-sm">{formatDate(main.createdAt)}</span>
                </div>

                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  <span className="text-sm">{main.views || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <div className="flex flex-col gap-4">
          {rightBlogs.map((b) => {
            if (!b) return null;
            const bookmarked = isBookmarked ? isBookmarked(b.id) : false;
            return (
              <Link
                key={b.id || b.slug}
                to={`/blog/${b.slug || b.id}`}
                onClick={() => handleViewIncrement(b.slug || b.id)}
                className="relative overflow-hidden group rounded-md block"
                aria-label={`Open article ${b.title}`}
              >
                <div className="w-full h-32 sm:h-36 md:h-[156px] relative overflow-hidden rounded-md">
                  <img
                    src={b.imageUrl}
                    alt={b.title || "Article image"}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-md"
                  />
                  <div className="absolute inset-0 p-3 flex flex-col justify-between text-white bg-gradient-to-b from-black/20 to-black/75">
                    <div>
                      <div className="mt-6">
                        <span className="px-2 py-1 text-[10px] font-semibold rounded bg-[#EB5757] shadow shadow-red-500 inline-block">
                          {b.category}
                        </span>
                      </div>
                      <p className="text-[14px] font-medium mt-5 line-clamp-2 group-hover:text-red-600">
                        {b.title}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(b.createdAt)}</span>
                        <div className="flex ml-2 items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          <span>{b.views || 0}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleBookmark(e, b.id)}
                        className="p-1 rounded-full"
                        aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
                        type="button"
                      >
                        {bookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-8 rounded-md overflow-hidden">
        <HeroCarousel />
      </div>
    </>
  );
}

function Top1Skeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="relative overflow-hidden group col-span-2 animate-pulse bg-gray-100 rounded-md">
        <div className="w-full h-64 sm:h-80 md:h-[420px] lg:h-[500px] bg-gray-200 rounded-md" />

        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/35 via-black/20 to-transparent">
          <div className="w-20 h-6 bg-gray-200 rounded mb-3" />

          <div className="space-y-2 mt-3">
            <div className="w-3/4 h-6 bg-gray-200 rounded" />
            <div className="w-1/2 h-6 bg-gray-200 rounded" />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs mt-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div className="w-16 h-4 bg-gray-200 rounded" />
            </div>

            <div className="flex items-center">
              <div className="w-20 h-4 bg-gray-200 rounded" />
            </div>

            <div className="flex items-center">
              <div className="w-12 h-4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="relative overflow-hidden group animate-pulse bg-gray-100 rounded-md"
          >
            <div className="w-full h-32 sm:h-36 md:h-[156px] bg-gray-200 rounded-md" />

            <div className="absolute inset-0 p-3 flex flex-col justify-between bg-gradient-to-b from-black/5 to-black/30">
              <div>
                <div className="w-12 h-4 bg-gray-200 rounded mb-2" />
                <div className="space-y-1">
                  <div className="w-full h-3 bg-gray-200 rounded" />
                  <div className="w-2/3 h-3 bg-gray-200 rounded" />
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <div className="w-16 h-3 bg-gray-200 rounded" />
                <div className="w-4 h-4 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
