// services/cacheService.js
import { blogService } from "./blogService";

class CacheService {
  constructor() {
    this.cache = new Map();          
    this.DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

    // Define keys
    this.KEYS = {
      LATEST_BLOGS: "latest_blogs",
      BLOG_DETAIL: (id) => `blog_detail_${id}`,
      USER_BOOKMARKS: (userId) => `user_bookmarks_${userId}`,
      SEARCH_RESULTS: (term, category) => `search_${term}_${category}`,
      BLOG_HISTORY: (page) => `blog_history_${page}`,
      CATEGORIES: "blog_categories",
    };
  }

  // Store item in cache
  set(key, data, ttl = this.DEFAULT_TTL) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // Retrieve item from cache
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Check if key exists and is valid
  has(key) {
    const item = this.cache.get(key);
    if (!item) return false;

    const now = Date.now();
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Delete a key
  delete(key) {
    return this.cache.delete(key);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
  }

  // Cache size
  size() {
    return this.cache.size;
  }

  // Remove expired items
  cleanExpired() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Instantiate a single cache service
export const cacheService = new CacheService();

// Automatically clean expired items every 10 minutes
setInterval(() => {
  cacheService.cleanExpired();
}, 10 * 60 * 1000);

// --- Cached Blog Service ---
export const cachedBlogService = {
  // Cached latest blogs
  getLatestBlogs: async () => {
    const cached = cacheService.get(cacheService.KEYS.LATEST_BLOGS);
    if (cached) return cached;

    // If not cached, fetch from blogService
    // Placeholder: return empty array since subscription pattern doesn't fit caching
    return [];
  },

  // Cache search results
  searchBlogsWithCache: async (searchTerm, category = "all") => {
    const cacheKey = cacheService.KEYS.SEARCH_RESULTS(searchTerm, category);
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    const results = await blogService.searchBlogs(searchTerm, category);
    cacheService.set(cacheKey, results, 2 * 60 * 1000); // cache 2 minutes

    return results;
  },

  // Cache individual blog details
  getBlogWithCache: async (blogId) => {
    const cacheKey = cacheService.KEYS.BLOG_DETAIL(blogId);
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    // Fetch from blogService or Firestore
    // Placeholder: return null
    return null;
  },

  // Invalidate caches when new blogs are generated
  invalidateBlogCaches: () => {
    cacheService.delete(cacheService.KEYS.LATEST_BLOGS);

    // Delete all search caches
    const searchKeys = Array.from(cacheService.cache.keys()).filter((key) =>
      key.startsWith("search_")
    );
    searchKeys.forEach((key) => cacheService.delete(key));
  },
};
