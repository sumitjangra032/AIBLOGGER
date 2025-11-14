import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { Calendar, Eye, Bookmark, BookmarkCheck } from "lucide-react";
import { auth } from "../../firebase";
import { useState, useEffect,useRef,useMemo } from "react";
import HeroCarousel from "../HeroSection";

export default function Top1({ blogs, onBookmarkToggle, onViewIncrement, loading, isBookmarked }) {
  const [user] = useAuthState(auth);
  const [typingTitle, setTypingTitle] = useState("");
  const [, setTypingIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [randomIndex, setRandomIndex] = useState(null)

  useEffect(() => {
    if (!blogs?.length) return

    const saved = localStorage.getItem("top1_random_index")

    if (saved !== null && saved < blogs.length) {
      setRandomIndex(parseInt(saved))
    } else {
      const idx = Math.floor(Math.random() * blogs.length)
      localStorage.setItem("top1_random_index", idx.toString())
      setRandomIndex(idx)
    }
  }, [blogs])

  const main = useMemo(() => {
    if (randomIndex === null) return null
    return blogs[randomIndex]
  }, [blogs, randomIndex])

  const rightBlogs = useMemo(() => {
    if (randomIndex === null) return []
    return blogs.slice(randomIndex + 1, randomIndex + 4)
  }, [blogs, randomIndex])

  
  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently";
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

const [typingSpeed,] = useState(60)
const RESTART_DELAY = 50000

const typingIntervalRef = useRef(null)
const restartIntervalRef = useRef(null)

useEffect(() => {
  if (!main || loading) return

  const title = main.title || ""

  const startTyping = () => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)

    setTypingTitle("")
    setTypingIndex(0)
    setIsTypingComplete(false)

    let i = 0
    typingIntervalRef.current = setInterval(() => {
      setTypingTitle(title.slice(0, i + 1))
      setTypingIndex(i + 1)

      if (i + 1 >= title.length) {
        setIsTypingComplete(true)
        clearInterval(typingIntervalRef.current)
      }
      i++
    }, typingSpeed)
  }

  startTyping()

  if (restartIntervalRef.current) clearInterval(restartIntervalRef.current)
  restartIntervalRef.current = setInterval(() => {
    startTyping()
  }, RESTART_DELAY)

  return () => {
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
    if (restartIntervalRef.current) clearInterval(restartIntervalRef.current)
  }
}, [main, loading, typingSpeed])


  if (loading) {
    return <Top1Skeleton />;
  }

  if (!blogs || blogs.length === 0) return null;
 
  if (!main) return null 

  const handleBookmark = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) onBookmarkToggle(id);
    else window.location.href = "/signin";
  };

  return (
    <>
    <section className="max-w-7xl mx-auto  pt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      {/* Main Blog Post */}
      <Link
        to={`/blog/${main.slug || main.id}`}
        onClick={() => onViewIncrement(main.slug || main.id)}
        className="relative h-[500px] overflow-hidden group col-span-2"
        >
        <img
            src={main.imageUrl}
            alt={main.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
            <span className="px-3 py-1 text-xs font-semibold rounded bg-[#EB5757]">
            {main.category}
            </span>

            <h2 className="text-2xl font-semibold mt-3 line-clamp-2 min-h-[3.5rem] group-hover:text-red-600">
            {typingTitle || main.title}
            {!isTypingComplete && typingTitle.length < main.title.length && (
                <span className="inline-block w-1 h-6 bg-white ml-1 animate-pulse"></span>
            )}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-200 mt-3">
            <div className="flex items-center space-x-2">
                <img
                src={`/author_images/${main.author}.jpg`}
                alt={main.author}
                className="w-8 h-8 rounded-full object-cover"
                />
                <p>By {main.author}</p>
            </div>

            <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(main.createdAt)}
            </div>

            <div className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {main.views || 0}
            </div>
            </div>
        </div>
        </Link>

      {/* Right Side Blogs */}
      <div className="flex flex-col gap-4">
        {rightBlogs.map((b) => {
          const bookmarked = isBookmarked(b.id);
          return (
            <Link
              key={b.id}
              to={`/blog/${b.slug || b.id}`}
              onClick={() => onViewIncrement(b.slug || b.id)}
              className="relative h-[156px] overflow-hidden group "
            >
              <img
                src={b.imageUrl}
                alt={b.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 "
              />

              <div className="absolute inset-0 p-3 flex flex-col justify-between text-white bg-gradient-to-b from-black/20 to-black/75">
                <div>
                  <div className="mt-6">
                    <span className="px-2 py-1 text-[10px] font-semibold rounded bg-[#EB5757]">
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
                        {formatDate(main.createdAt)}
                        <div className="flex ml-2 items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {b.views || 0}
                        </div>
                    </div>
                    

                  <button
                    onClick={(e) => handleBookmark(e, b.id)}
                    className="p-1 rounded-full"
                  >
                    {bookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
    <div className="mx-auto mx-20 mb-8">
     <HeroCarousel />
    </div>

    </>

  );
}

// Skeleton Loading Component (unchanged)
function Top1Skeleton() {
  return (
    <section className="max-w-7xl mx-auto px-3 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="relative h-[420px] overflow-hidden group col-span-2 animate-pulse bg-gray-100 rounded-md">
        <div className="w-full h-full bg-gray-200"></div>

        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/35 via-black/20 to-transparent">
          <div className="w-20 h-6 bg-gray-200 rounded mb-3"></div>

          <div className="space-y-2 mt-3">
            <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
            <div className="w-1/2 h-6 bg-gray-200 rounded"></div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs mt-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
            </div>

            <div className="flex items-center">
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>

            <div className="flex items-center">
              <div className="w-12 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="relative h-[130px] overflow-hidden group animate-pulse bg-gray-100 rounded-md"
          >
            <div className="w-full h-full bg-gray-200"></div>

            <div className="absolute inset-0 p-3 flex flex-col justify-between bg-gradient-to-b from-black/5 to-black/30">
              <div>
                <div className="w-12 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="space-y-1">
                  <div className="w-full h-3 bg-gray-200 rounded"></div>
                  <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
                <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}