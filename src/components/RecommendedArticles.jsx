import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { db } from "../firebase"
import { collection, query, getDocs } from "firebase/firestore"

export default function RecommendedArticles({ category, excludeId }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  function getReadTime(text) {
    const words = text?.trim()?.split(/\s+/)?.length || 0
    return Math.max(1, Math.ceil(words / 200))
  }

  useEffect(() => {
    async function load() {
      const q = query(collection(db, "blogs"))
      const snap = await getDocs(q)

      let items = snap.docs.map(d => {
        const data = d.data()
        const readTime = getReadTime(data?.content)
        return {
          id: d.id,
          ...data,
          readTime,
        }
      })

      items = items.filter(x => x.id !== excludeId)
      items = items.sort(() => Math.random() - 0.5).slice(0, 6)

      setArticles(items)
      setLoading(false)
    }

    load()
  }, [category, excludeId])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
        Recommended Articles
      </h2>

      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 py-3 animate-pulse rounded-lg"
            >
              <div className="w-20 h-20 bg-slate-300/70 dark:bg-slate-700 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))}

        {!loading &&
          articles.length > 0 &&
          articles.map((item, i) => {
            const limitedTitle =
              item.title && item.title.length > 100
                ? item.title.slice(0, 100) + "…"
                : item.title

            return (
              <Link
                key={i}
                to={`/blog/${item.id}`}
                className="group flex items-start gap-3 py-3 rounded-md transition-all duration-150 hover:bg-slate-150 dark:hover:bg-slate-800/40 hover:shadow-sm"
              >
                <img
                  src={item.imageUrl || "/placeholder_image.jpg"}
                  className="w-20 h-20 rounded-lg object-cover"
                  alt="Reference"
                />

                <div className="flex-1 space-y-2">

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-200 text-slate-550">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200 group-hover:text-sky-600">
                    {limitedTitle}
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {item.readTime} min read
                    </span>

                    {typeof item.views === "number" && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {item.views} views
                      </span>
                    )}
                  </div>

                </div>
              </Link>
            )
          })}
      </div>

      {!loading && articles.length === 0 && (
        <div className="text-sm text-slate-500 dark:text-slate-400 py-3">
          No similar articles found
        </div>
      )}
    </div>
  )
}
