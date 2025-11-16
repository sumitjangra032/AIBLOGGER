import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import {
  FaInstagram,
  FaYoutube,
  FaGithub,
  FaLinkedinIn,
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";
import { Calendar } from "lucide-react";

export default function Top3() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"), limit(6));
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (mounted) setBlogs(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchBlogs();
    return () => {
      mounted = false;
    };
  }, []);

  const main = blogs[0];
  const small = blogs.slice(1, 4);

  const socialLinks = [
    { name: "Instagram", icon: FaInstagram, color: "text-pink-600", hoverBg: "hover:bg-pink-600", url: "https://www.instagram.com/sumit_rajotia?igsh=ejltc3RqdWNnaWth/" },
    { name: "YouTube", icon: FaYoutube, color: "text-red-600", hoverBg: "hover:bg-red-600", url: "https://www.youtube.com/@sumit.rajotiaa" },
    { name: "LinkedIn", icon: FaLinkedinIn, color: "text-blue-700", hoverBg: "hover:bg-blue-700", url: "https://www.linkedin.com/in/sumit-jangra-765b7024a/" },
    { name: "GitHub", icon: FaGithub, color: "text-gray-900", hoverBg: "hover:bg-gray-900", url: "https://github.com/sumitjangra032/" },
  ];

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-7">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-[300px] sm:h-[420px] bg-gray-200 rounded-sm animate-pulse" />
            <div className="flex flex-col space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="grid grid-cols-3 gap-4 items-center">
                  <div className="col-span-2 space-y-2">
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-full h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="w-28 h-3 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="col-span-1">
                    <div className="w-full h-20 bg-gray-200 rounded-sm animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-cyan-500 text-white rounded-sm p-6 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl">
            <div className="w-48 h-6 bg-white/25 rounded animate-pulse" />
            <div className="w-24 h-8 bg-white rounded-full animate-pulse" />
          </div>
        </div>

        <div className="lg:col-span-1 w-full">
          <div className="mb-6">
            <div className="w-40 h-6 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full h-12 bg-gray-200 rounded-sm animate-pulse" />
            ))}
          </div>
          <div className="bg-gray-800 p-6 rounded-sm text-white text-center">
            <div className="w-12 h-12 bg-gray-700 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="w-36 h-6 bg-gray-700 rounded mx-auto mb-3 animate-pulse" />
            <div className="w-full h-4 bg-gray-700 rounded mx-auto mb-4 animate-pulse" />
            <div className="w-full h-12 bg-gray-700 rounded-sm mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-7">
      {/* Main Content - Left Side */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-red-500 pb-1">Recent Posts</h2>
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

        {/* Featured Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {/* Main Featured Post */}
          {main ? (
            <Link 
              to={`/blog/${main?.slug || main.id}`} 
              className="relative h-[300px] sm:h-[420px] overflow-hidden group rounded-md shadow-md"
            >
              <img
                src={main?.imageUrl || "https://picsum.photos/seed/tech1/1200/800"}
                alt={main?.title || "Featured post"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-md"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="inline-block text-xs font-semibold px-3 py-1 rounded-md bg-[#EB5757] uppercase mb-3 shadow shadow-red-500">
                  {main?.category || "NEWS"}
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-3 line-clamp-2 hover:text-red-500">
                  {main?.title || "Untitled"}
                </h3>
                <div className="flex flex-wrap items-center text-sm text-gray-200">
                  <span>By {main?.author || "Admin"}</span>
                  <Calendar className="ml-2 w-4 h-4 mr-2" />
                  <span>{formatDate(main?.createdAt)}</span>
                  <span className="ml-2 ">{main?.views || 0} Views</span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="h-[300px] sm:h-[420px] bg-gray-100 rounded-sm flex items-center justify-center">
              <p className="text-gray-500">No featured post available</p>
            </div>
          )}

          {/* Small Posts List */}
          <div className="flex flex-col space-y-4">
            {small.length > 0 ? (
              small.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post?.slug || post.id}`}
                  className="grid grid-cols-3 items-center py-2 rounded-sm hover:bg-gray-50 transition-colors group overflow-hidden border-b border-gray-300"
                >
                  <div className="col-span-2 space-y-3">
                    <span className="inline-block text-white text-xs font-semibold px-2 py-1 uppercase rounded-md bg-[#EB5757] shadow shadow-red-500">
                      {post?.category || "NEWS"}
                    </span>
                    <h4 className="text-sm font-bold pr-2 text-gray-900 line-clamp-2 hover:text-red-600 transition-colors">
                      {post?.title || "Untitled"}
                    </h4>
                    <div className="flex flex-wrap items-center">
                      <Calendar className="w-4 h-4" />
                      <p className="ml-1 text-xs text-gray-500">{formatDate(post?.createdAt)}</p>
                    </div>
                  </div>
                  <div className="col-span-1 overflow-hidden rounded-sm aspect-[4/3] rounded-md">
                    <img 
                      src={post?.imageUrl || `https://picsum.photos/seed/tech${post?.id || Math.random()}/100/100`} 
                      alt={post?.title || "thumb"} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-md"
                    />
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No additional posts available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar - Right Side */}
      <div className="lg:col-span-1 ">
        {/* Social Links Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 pb-1 mb-6">
                <span className="border-b-2 border-red-500 pb-1">
                Subscribe & Followers
                </span>
            </h3>
          <div className="grid grid-cols-2 gap-3">
            {socialLinks.map((link) => (
              <a 
                key={link.name}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center justify-center p-3 bg-gray-100 border border-gray-200 rounded-sm shadow-sm group ${link.hoverBg} hover:text-white transition-all duration-300 hover:scale-105`}
              >
                <link.icon className={`w-5 h-5 mr-3 ${link.color} group-hover:text-white transition-colors`} />
                <span className="text-s font-semibold text-gray-700 group-hover:text-white transition-colors">
                  {link.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gray-800 p-6 rounded-md text-white rounded-md ">
          <div className="text-center mb-5 ">
            <FaEnvelope className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h4 className="text-2xl font-bold mb-3">Daily Newsletter</h4>
            <p className="text-sm text-gray-300 mt-4">
              Get All The Top Stories from Blogs To Keep Track.
            </p>
          </div>

          <div className="relative py-5" >
            <input 
              type="email" 
              placeholder="Enter your e-mail" 
              className="w-full py-3 pl-4 pr-16 text-sm text-gray-800 bg-white  focus:outline-none focus:ring-2 focus:ring-red-500 "
            />
            <button 
              type="submit" 
              className="absolute right-0 top-0 h-11 w-14 bg-red-500 mt-5 flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <FaPaperPlane className="w-5 h-5 text-white " />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}