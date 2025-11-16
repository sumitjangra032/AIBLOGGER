import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import BlogCard from "../components/BlogCard";
import { blogService } from "../services/blogServices";
import { BLOG_CATEGORIES } from "../types/blog";

export default function CategoryPage() {
  const { slug } = useParams();
  const [allBlogs, setAllBlogs] = useState([]);
  const [displayBlogs, setDisplayBlogs] = useState([]);
  const [filters, ] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 9;

  const validCategory = BLOG_CATEGORIES.find((c) => {
  console.log("Checking c :", c);
  console.log("Checking slug :", slug);

  return c?.toLowerCase() === slug?.toLowerCase();
});
const loadBlogs = useCallback(
  (blogs) => {
    let filtered = blogs.filter(
      (b) => b?.category?.toLowerCase() === slug?.toLowerCase()
    );

    if (filters.length > 0) {
      filtered = filtered.filter((b) =>
        b.tags?.some((t) => filters.includes(t.toLowerCase()))
      );
    }

    filtered = filtered.sort(
      (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    );

    setAllBlogs(filtered);

    const end = pageIndex * pageSize;
    setDisplayBlogs(filtered.slice(0, end));
    setLoading(false);
  },
  [slug, filters, pageIndex]
);


  useEffect(() => {
    const unsub = blogService.getLatestBlogs((newBlogs) => {
      loadBlogs(newBlogs);
    });
    return unsub;
  }, [slug, filters, pageIndex, loadBlogs]);

  const handleLoadMore = () => {
    setPageIndex((prev) => prev + 1);
  };

  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY + 80 >=
        document.body.offsetHeight
      ) {
        handleLoadMore();
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // const toggleFilter = (tag) => {
  //   const t = tag.toLowerCase();
  //   if (filters.includes(t)) {
  //     setFilters(filters.filter((f) => f !== t));
  //   } else {
  //     setFilters([...filters, t]);
  //   }
  //   setPageIndex(1);
  // };

  if (!validCategory) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-4">
          Category Not Found
        </h1>
        <Link
          to="/"
          className="underline text-blue-600 hover:opacity-75"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-12">
        <div className="flex items-center text-sm mb-4 space-x-1">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <span className="capitalize">{slug}</span>
        </div>

        <h1 className="text-3xl font-semibold capitalize mb-6">
          {slug}
        </h1>

        {loading ? (
          <div className="flex justify-center h-64 items-center">
            <div className="animate-spin h-10 w-10 rounded-full border-b-2 border-sky-500"></div>
          </div>
        ) : allBlogs.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            No Blogs Found
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>

            {displayBlogs.length < allBlogs.length && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  className="px-5 py-2 rounded-md bg-sky-500 text-white hover:bg-sky-600"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
