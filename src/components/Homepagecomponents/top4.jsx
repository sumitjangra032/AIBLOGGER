import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";



export default function Top4() {
  const [trending, setTrending] = useState([]);

   const formatDate = (ts) => {
    if (!ts) return "Recently";
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    if (isNaN(d.getTime())) return "Recently";
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "long" }).toUpperCase();
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  };
  
  useEffect(() => {
    const fetchTrending = async () => { 
      const q = query(
        collection(db, "blogs"),
        orderBy("views", "desc"),
        limit(4) 
      );

      try {
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp || new Date(), 
        }));
        setTrending(data);
      } catch (error) {
        console.error("Error fetching trending posts:", error);
      }
    };

    fetchTrending();
  }, []);

  const largePost = trending[0];
  const smallPosts = trending.slice(1, 4); 

  return (
    <section className="max-w-7xl mx-auto  py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-red-500 pb-1">Trending News</h2>
                <Link 
                    to="/history" 
                    className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center border border-red-500 px-4 py-2 rounded-sm transition-colors hover:bg-red-50"
                >
                    VIEW ALL
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6  mt-7" >
                <div className="lg:col-span-1 overflow-hidden rounded-md group aspect-[4/3]">
                    <img src={largePost?.imageUrl} 
                        alt={largePost?.title} 
                        className="w-full h-full object-cover overflow-hidden rounded-md transition-transform duration-300 ease-out group-hover:scale-105" />
                </div>
                <div className="lg:col-span-1">
                    <span className="inline-block text-xs text-white font-semibold px-3 py-1 rounded-sm bg-[#EB5757] uppercase mb-3">
                        {largePost?.category || "NEWS"}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{largePost?.title}</h3>
                    <div className="flex flex-wrap items-center text-sm text-gray-900 gap-3 mt-3">
                        <span>By {largePost?.author || "Admin"}</span>
                        <span>•</span>
                        <span>{formatDate(largePost?.createdAt)}</span>
                        <span>•</span>
                        <span>{largePost?.views || 0} Views</span>
                    </div>
                    <p className="text-gray-700 mt-3 mb-6">{largePost?.excerpt}</p>
                    <div className="">
                        <Link 
                        to={`/blog/${largePost?.slug}`}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold shadow shadow-red-500 px-4 py-2 rounded-sm transition-colors hover:bg-red-50"
                        >
                        READ MORE
                        </Link>
                    </div>
                </div>
                <div className="lg:col-span-2 flex flex-row items-center mx-auto gap-4">
                    {smallPosts.map((post) => (
                        <div key={post.id} className="space-y-1 flex-1">
                        <div className="relative overflow-hidden rounded-md group aspect-[4/3]">
                            <img
                            src={post?.imageUrl}
                            alt={post?.title}
                            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                            />
                            <span className="absolute bottom-2 left-2 inline-block text-xs text-white font-semibold px-3 py-1 rounded-sm bg-[#EB5757] uppercase">
                            {post?.category || "NEWS"}
                            </span>
                        </div>
                        <div>
                            <Link 
                                to={`/blog/${largePost?.slug}`}
                                className="text-sm font-bold text-gray-900 hover:text-red-500 transition-colors">
                                {post?.title?.length > 60
                                ? post.title.substring(0, 60) + "..."
                                : post.title}
                                
                            </Link>
                        </div>
                        <div className="flex flex-wrap items-center text-sm text-gray-900 gap-2 mt-2">
                            <span>{post?.author || "Admin"}</span>
                            <span>•</span>
                            <span>{formatDate(post?.createdAt)}</span>
                            {/* <span>•</span>
                            <span>{post?.views || 0} Views</span> */}
                         </div>

                        </div>
                    ))}
                </div>

            </div>

        </div>
     
    </section>
  );
}