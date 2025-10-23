// types/blog.js

/**
 * @typedef {Object} Blog
 * @property {string} id - Unique identifier for the blog post
 * @property {string} title - Title of the blog post
 * @property {string} content - Full content/body of the blog post
 * @property {string} excerpt - Short excerpt/summary of the blog post
 * @property {string[]} tags - Array of tags associated with the blog post
 * @property {string} category - Category classification of the blog post
 * @property {string} author - Author name of the blog post
 * @property {*} createdAt - Creation timestamp (Firestore Timestamp)
 * @property {number} views - Number of views/reads for the blog post
 * @property {string} [imageUrl] - Optional image URL for the blog post
 */

/**
 * @typedef {Object} Bookmark
 * @property {string} id - Unique identifier for the bookmark
 * @property {string} userId - ID of the user who created the bookmark
 * @property {string} blogId - ID of the blog post being bookmarked
 * @property {*} createdAt - Timestamp when the bookmark was created
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} uid - Unique user identifier from Firebase Auth
 * @property {string} email - User's email address
 * @property {string} displayName - User's display name
 * @property {string} [photoURL] - Optional profile photo URL
 * @property {string[]} bookmarks - Array of bookmarked blog post IDs
 * @property {Object} preferences - User preferences object
 * @property {boolean} preferences.darkMode - User's dark mode preference
 */

/**
 * @typedef {Object} SearchFilters
 * @property {string} [category] - Optional category filter
 * @property {string[]} [tags] - Optional tags filter array
 * @property {{start: Date, end: Date}} [dateRange] - Optional date range filter
 */

/** Constant array of available blog categories */
export const BLOG_CATEGORIES = [
  "Technology",
  "Travel",
  "Lifestyle",
  "Business",
  "Health",
  "Science",
  "Entertainment",
  "Sports",
  "Food",
  "Fashion",
  "Crypto",
  "Education",
  "Environment",
  "Politics",
  "Art",
];

/** @typedef {typeof BLOG_CATEGORIES[number]} BlogCategory */
