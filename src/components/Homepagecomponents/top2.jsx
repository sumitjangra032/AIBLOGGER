import { useRef, useMemo } from "react"
import { Link } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth"
import { Calendar, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck } from "lucide-react"
import { auth } from "../../firebase"

export default function Top2({
  blogs,
  onBookmarkToggle,
  onViewIncrement,
  loading,
  isBookmarked,
}) {
  const [user] = useAuthState(auth)
  const containerRef = useRef(null)

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently"
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const sortedBlogs = useMemo(() => {
    if (!blogs) return []
    return blogs.slice().reverse().slice(0, 8)
  }, [blogs])

  const scroll = (dir = "right") => {
    if (!containerRef.current) return
    const w = containerRef.current.clientWidth
    const amount = Math.floor(w * 0.8)
    containerRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" })
  }

  const handleBookmark = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if (user) onBookmarkToggle(id)
    else window.location.href = "/signin"
  }

  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-3 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold"> </h3>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          </div>
        </div>

        <div className="hidden md:flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="min-w-[520px] h-32 bg-white rounded-md overflow-hidden shadow p-3 flex gap-3 animate-pulse"
            >
              <div className="w-44 min-w-[176px] h-28 bg-gray-200 rounded-md" />
              <div className="flex-1 flex flex-col justify-between gap-2 py-1">
                <div className="w-20 h-4 bg-gray-200 rounded" />
                <div className="w-full h-5 bg-gray-200 rounded" />
                <div className="w-3/5 h-4 bg-gray-200 rounded" />
                <div className="flex justify-between mt-auto">
                  <div className="flex gap-3">
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                    <div className="w-10 h-4 bg-gray-200 rounded" />
                  </div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="md:hidden flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-[80%] mx-auto bg-white rounded-md shadow p-4 animate-pulse">
              <div className="w-full h-36 bg-gray-200 rounded-md" />
              <div className="mt-3 space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded" />
                <div className="w-full h-5 bg-gray-200 rounded" />
                <div className="w-3/5 h-4 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )

  if (!sortedBlogs.length) return null

  return (
    <div className="max-w-7xl mx-auto mt-3 relative mb-2 px-3">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-red-500 pb-1">
          Editor's Choice
        </h3>

        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
          >
            <ChevronLeft size={18} className="stroke-red-500" />
          </button>

          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center"
          >
            <ChevronRight size={18} className="stroke-red-500" />
          </button>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden flex flex-col gap-6">
        {sortedBlogs.map((b) => {
          const bookmarked = isBookmarked(b.id)
          return (
            <Link
              key={b.id}
              to={`/blog/${b.slug || b.id}`}
              onClick={() => onViewIncrement(b.slug || b.id)}
              className="w-[80%] mx-auto bg-white rounded-md shadow-sm overflow-hidden flex flex-col"
            >
              <img src={b.imageUrl} alt={b.title} className="w-full h-40 object-cover rounded-md" />

              <div className="p-3 flex-1 flex flex-col justify-between">
                {/* CATEGORY (Unified - Option B) */}
                <span className="inline-block text-[10px] uppercase font-semibold bg-[#EB5757] text-white px-2 py-1 rounded-md shadow">
                  {b.category || "NEWS"}
                </span>

                <h4 className="mt-2 text-sm font-semibold leading-tight line-clamp-2 text-gray-800">
                  {b.title}
                </h4>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(b.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                        <circle cx="12" cy="12" r="2.5" />
                      </svg>
                      <span>{b.views || 0}</span>
                    </div>
                  </div>

                  <button onClick={(e) => handleBookmark(e, b.id)} className="p-1">
                    {bookmarked ? (
                      <BookmarkCheck size={16} className="text-yellow-400" />
                    ) : (
                      <Bookmark size={16} />
                    )}
                  </button>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* DESKTOP */}
      <div
        ref={containerRef}
        className="hidden md:flex gap-4 overflow-x-auto snap-x snap-mandatory custom-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        {sortedBlogs.map((b) => {
          const bookmarked = isBookmarked(b.id)
          return (
            <Link
              key={b.id}
              to={`/blog/${b.slug || b.id}`}
              onClick={() => onViewIncrement(b.slug || b.id)}
              className="min-w-[520px] snap-start bg-white rounded-sm overflow-hidden shadow-sm flex hover:shadow-md transition"
            >
              <div className="group w-44 min-w-[176px] h-36 overflow-hidden rounded-md">
                <img
                  src={b.imageUrl}
                  alt={b.title}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105 rounded-md"
                />
              </div>

              <div className="flex-1 p-3 flex flex-col justify-between">

                <div className="flex-1">
                  <span className="inline-block text-[10px] uppercase font-semibold bg-[#EB5757] text-white px-2 py-1 rounded-md shadow">
                    {b.category}
                  </span>
                </div>
                
                <h4 className="mt-2 text-sm md:text-base font-semibold leading-tight line-clamp-2 text-gray-800 hover:text-red-500">
                  {b.title}
                </h4>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{formatDate(b.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                        <circle cx="12" cy="12" r="2.5" />
                      </svg>
                      <span>{b.views || 0}</span>
                    </div>
                  </div>

                  <button onClick={(e) => handleBookmark(e, b.id)} className="p-1 rounded-full">
                    {bookmarked ? (
                      <BookmarkCheck size={16} className="text-yellow-400" />
                    ) : (
                      <Bookmark size={16} />
                    )}
                  </button>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
