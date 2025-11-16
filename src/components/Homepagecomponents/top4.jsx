import { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import { ArrowUpRight , Calendar} from "lucide-react";



export default function Top4() {
  const [trending, setTrending] = useState([]);

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

  const categories = [
    { name: "Technology", image: "../../category/Technology/Technology.jpg" },
    { name: "Travel", image: "../../category/Travel/Travel.jpg" },
    { name: "Lifestyle", image: "../../category/Lifestyle/Lifestyle.jpg" },
    { name: "Business", image: "../../category/Business/Business.jpg" },
    // { name: "Health", image: "../../category/Health/Health.jpg" },
    // { name: "Science", image: "../../category/Science/Science.jpg" },
    // { name: "Entertainment", image: "../../category/Entertainment/Entertainment.jpg" },
    // { name: "Sports", image: "../../category/Sports/Sports.jpg" },
    // { name: "Food", image: "../../category/Food/Food.jpg" },
    // { name: "Fashion", image: "../../category/Fashion/Fashion.jpg" },
    // { name: "Crypto", image: "../../category/Crypto/Crypto.jpg" },
    // { name: "Education", image: "../../category/Education/Education.jpg" },
    // { name: "Environment", image: "../../category/Environment/Environment.jpg" },
    // { name: "Politics", image: "../../category/Politics/Politics.jpg" },
    // { name: "Art", image: "../../category/Art/Art.jpg" },
  ];

  useEffect(() => {
    const fetchTrending = async () => { 
      const q = query(
        collection(db, "blogs"),
        orderBy("views", "desc"),
        limit(8) 
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
  const popularPosts = trending.slice(5, 8); 

  console.log("Trending Posts:", popularPosts.id);


  return (

      <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2">
            {/* CTA Banner */}
                <div className="bg-cyan-500 text-white rounded-md p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl ">
                  <h3 className="text-xl sm:text-2xl font-bold text-center sm:text-left">Modern Technology Fest Here</h3>
                  <Link 
                  to="/history"
                  className="bg-white text-cyan-500 font-semibold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap"
                  >
                See Details
                </Link>
            </div>
          </div>
          <div className="lg:col-span-1 lg:row-span-2 mb-5">
              <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-red-500 inline-block pb-1">Top Categories</h2>
              <div className="space-y-1 w-full max-w-md mx-auto mt-5">
              {categories.map((cat, index) => (
                <div
                  key={index}
                  className="relative h-20 rounded-xl overflow-hidden group"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/50"></div>

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-sm font-semibold tracking-wide px-3 py-1 bg-white/20 to bg-black/20  rounded-xl backdrop-blur-sm ">
                    {cat.name}
                  </span>
                  <Link 
                    to={`/category/${cat.name.toLowerCase()}`}
                    className="absolute inset-0"
                  >
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-xl opacity-80 group-hover:opacity-100">
                      <ArrowUpRight className="w-7 h-7" />
                    </div>
                  <div className="absolute right-8 top-1/2 -translate-y-1/10 text-white text-xl opacity-40">
                    <ArrowUpRight className="w-7 h-7" />
                  </div>
                  </Link>
                </div>
              ))}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-red-500 inline-block pb-1 pt-3 mb-2">Popular Posts</h2>
                {popularPosts.map((post) => (
                  <div key={post.id}>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-2  mt-2" >
                  <div className="lg:col-span-1 overflow-hidden rounded-md group aspect-[4/3]">
                          <img src={post?.imageUrl} 
                              alt={post?.title} 
                              className="w-full h-full object-cover overflow-hidden rounded-md transition-transform duration-300 ease-out group-hover:scale-105" />
                      </div>
                      <div className="lg:col-span-2 border-b border-gray-300">
                          <span className="inline-block text-xs text-white font-semibold px-3 py-1 rounded-md bg-[#EB5757] uppercase mb-2 shadow shadow-red-500">
                              {post?.category || "NEWS"}
                          </span>
                          <Link
                              to={`/blog/${post?.slug || post.id}`}
                              className="flex flex-wrap text-sm font-bold text-gray-900 hover:text-red-500 transition-colors group group-hover:text-red-500">
                              {post?.title?.length > 60
                              ? post.title.substring(0, 60) + "..."
                              : post.title}
                          </Link>
                          <div className="flex flex-wrap items-center text-sm text-gray-900  mt-1">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span>{formatDate(post?.createdAt)}</span>
                              <span className="ml-2">{post?.views} views</span>

                          </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
          <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-red-500 pb-1">Trending Articles</h2>
                  <Link 
                      to="/history" 
                      className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center shadow shadow-red-500 px-4 py-2 rounded-md transition-colors hover:bg-red-50"
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
                      <span className="inline-block text-xs text-white font-semibold px-3 py-1 rounded-md bg-[#EB5757] uppercase mb-3 shadow shadow-red-500">
                          {largePost?.category || "NEWS"}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{largePost?.title}</h3>
                      <div className="flex flex-wrap items-center text-sm text-gray-900  mt-3">
                          <span>By {largePost?.author || "Admin"}</span>
                          <Calendar className="ml-2 w-4 h-4 mr-2" />
                          <span>{formatDate(largePost?.createdAt)}</span>
                          <span className="ml-2">{largePost?.views || 0} Views</span>
                      </div>
                      <p className="text-gray-700 mt-3 mb-6">{(largePost?.excerpt ?? "")
                                                              .replace(/^\s*(?:#+\s*)?(?:introduction\b[\s:—-]*)/i, "")
                                                              .replace(/#/g, "")
                                                              .trim()}</p>
                      <div className="">
                          <Link 
                          to={`/blog/${largePost?.slug || largePost?.id}`}
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
                              <span className="absolute bottom-2 left-2 inline-block text-xs text-white font-semibold px-3 py-1 rounded-md bg-[#EB5757] uppercase shadow shadow-red-500">
                              {post?.category || "NEWS"}
                              </span>
                          </div>
                          <div>
                              <Link 
                                  to={`/blog/${post?.slug || post?.id}`}
                                  className="text-sm font-bold text-gray-900 hover:text-red-500 transition-colors">
                                  {post?.title?.length > 60
                                  ? post.title.substring(0, 60) + "..."
                                  : post.title}
                                  
                              </Link>
                          </div>
                          <div className="flex flex-wrap items-center text-sm text-gray-900 mt-2">
                              <span>{post?.author || "Admin"}</span>
                              <Calendar className="ml-2 w-4 h-4 mr-2" />
                              <span>{formatDate(post?.createdAt)}</span>
                          </div>

                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>
      
    
  );
}