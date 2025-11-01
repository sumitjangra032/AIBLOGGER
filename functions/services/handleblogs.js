import { defineSecret } from "firebase-functions/params";
import { db } from "../firebase.js";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateRandomAuthor } from "./AuthorName.js";
import { onInit }  from "firebase-functions/v2/core";
import {FieldValue } from "firebase-admin/firestore";



const GEMINI_KEY = defineSecret("GEMINI_API_KEY");

let genAI;

onInit(() => {
  genAI = new GoogleGenerativeAI(GEMINI_KEY.value());
})

const defaultTags = {
  Technology: ["AI", "Software", "Gadgets", "Cybersecurity", "Innovation"],
  Travel: ["Destinations", "Tips", "Hotels", "Adventure", "Budget Travel"],
  Lifestyle: ["Self-care", "Home", "Minimalism", "Motivation", "Relationships"],
  Business: ["Startups", "Finance", "Marketing", "Leadership", "Investing"],
  Health: ["Fitness", "Nutrition", "Mental Health", "Wellness", "Medicine"],
  Science: ["Space", "Biology", "Physics", "Research", "Discoveries"],
  Entertainment: ["Movies", "TV Shows", "Celebrities", "Music", "Reviews"],
  Sports: ["Football", "Cricket", "Fitness", "Tournaments", "Highlights"],
  Food: ["Recipes", "Restaurants", "Vegan", "Desserts", "Street Food"],
  Fashion: ["Trends", "Outfits", "Styling", "Brands", "Accessories"],
  Crypto: ["Bitcoin", "Blockchain", "NFT", "Trading", "Web3"],
  Education: ["Learning", "Courses", "Career", "Study Tips", "Skill Development"],
  Environment: ["Climate", "Pollution", "Sustainability", "Nature", "Energy"],
  Politics: ["Elections", "Government", "Policies", "World Affairs", "Debate"],
  Art: ["Painting", "Photography", "Design", "Culture", "Creativity"],
};

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

function parseBlogText(text) {
  const cleanText = text.replace(/\r/g, '').trim();

  const getField = (label) => {
    const regex = new RegExp(`${label}\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*(?:category|title|content|tags|author|imageUrl)\\s*:|$)`, 'i');
    const match = cleanText.match(regex);
    return match ? match[1].trim() : null;
  };

  const category = getField('category');
  const title = getField('title');
  const content = getField('content');
  const tagsRaw = getField('tags');
  const imageUrl = getField('imageUrl');

  const raw = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  const tags = raw > 0 ? raw : defaultTags[category];
  const author = generateRandomAuthor();

  return { category, title, content, tags, author, imageUrl };
}


const generateAIBlog = async () => {
  try {
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("Generating blog with AI...",genAI);

    const categories = BLOG_CATEGORIES;
    const category = categories[Math.floor(Math.random() * categories.length)];

    const prompt = `
    You are an expert AI content researcher, SEO strategist, and blog writer.

    Your task:
    1. Search for the latest trending topics in the category "${category}" based on:
      - Current news
      - Social media buzz
      - Public search interest

    2. Select the #1 trending topic in that category.

    3. For that topic, create a 5000-word on (How to do this/that topic) in long-form blog post following these instructions:

    ---

    ✍️ BLOG STRUCTURE & REQUIREMENTS

     category: ${category}
     title: Create a catchy, click-worthy, SEO-optimized title (e.g., “How to do this in 2025 — Step-by-Step Guide for Beginners”).
     content:
    - Minimum 5000 words, written in a natural, human-like, conversational tone.
    - Must be SEO-optimized with proper keyword density, bolded keywords, and relevant LSI terms.
    - Include the following structure:
      - (hook, brief context, what readers will learn)
      - H2 and H3 subheadings for logical flow
      - Short paragraphs for readability
      - Bullet points or numbered lists where helpful
      - Examples, statistics, and real-life insights of last  2 years
      - Engaging elements like anecdotes, questions, or quotes
      - Conclusion with a strong call-to-action (CTA)
      - Key Takeaways or Summary Section at the end
    - Use  (bold) and (italic) formatting for emphasis.
    - Include FAQs (at least 5) at the end related to the topic for SEO boost.

     tags: Add 5 to 10 SEO-relevant tags or keywords.

    ---

     OUTPUT FORMAT EXAMPLE

     category: Technology
     title: How to Use AI Tools to Automate Your Business in 2025 — The Complete Beginner’s Guide
     content: (Then the full 5000-word blog with headings, bold keywords, and short paragraphs)
     tags: AI, Automation, Business Tools, Productivity, Tech Trends
    

    “At the end, always output the final result in this exact text format (each field starts on a new line, labels in lowercase):

    category: <category name>  
    title: <title>  
    content: <blog content>  
    tags: <comma-separated tags>   
 
    Do not include emojis, Markdown, or bullet symbols — only plain text in this format. Also Please dont repeat names authod always must be different names
    And also dont use Introduction words at starting of content
    `;

    const retries = 10;
    let structuredBlog = null;
  

    for (let i = 0; i < retries; i++) {
      try {
        
        const aiResponse = (await (await model.generateContent([prompt])).response).text();
        console.log(" aiResponse:", aiResponse);

        structuredBlog = parseBlogText(aiResponse);
        console.log("✅ Parsed Blog:", structuredBlog);
        if (structuredBlog.title != null && structuredBlog.content != null){
          break;
        }
        else{
          continue;
        }
      } catch (err) {
        if (err.message.includes("503")) {
          console.warn(`Retry ${i + 1}/${retries} after 503 error...`);
          await new Promise(r => setTimeout(r, 15000));
        } else {
          throw err;
        }

      }
    }

    if (!structuredBlog) {
      throw new Error("AI failed to generate blog content after retries.");
    }

    const { title, content, tags, author } = structuredBlog;

    const excerpt = content ? content.substring(0, 150) + "..." : "";

    return {
      title,
      content,
      excerpt,
      category,
      tags: tags || [],
      author: author || generateRandomAuthor(),
      createdAt: FieldValue.serverTimestamp(),
      views: 0,
      imageUrl: generateImageUrl(category),
    };

  } catch (error) {
    console.error("❌ Error generating blog with AI:", error);
    return null;
  }
};


const generateImageUrl = (category) => {
  
  const imageCounts = {
    Technology: 100,
    Travel: 100,
    Lifestyle: 100,
    Business: 100,
    Health:100,
    Science: 100,
    Entertainment: 100,
    Sports: 100,
    Food: 100,
    Fashion: 100,
    Crypto: 100,
    Education: 100,
    Environment: 100,
    Politics: 100,
    Art: 100,
  };

  const count = imageCounts[category] || 100;
  const randomIndex = Math.floor(Math.random() * count) + 1;
  const imageName = `${category}_${randomIndex}.jpg`;
  return `/images/${category}/${imageName}`;
};


export const blogServiceNew = {
    generateBlogs: async (count = 12) => {
        const blogs = [];
        for (let i = 0; i < count; i++) {
        const blog = await generateAIBlog();
        const docRef = await db.collection("blogs").add(blog);
        blogs.push({ id: docRef.id, ...blog });
        }
        return blogs;
    },

    cleanupOldBlogs: async () => {
   

    const snapshot = await db
            .collection("blogs")
            .orderBy("createdAt", "desc")
            .limit(100)
            .get();

    const keepIds = snapshot.docs.map((doc) => doc.id);

    const allSnapshot = await db.collection("blogs").get();

    const deletePromises = allSnapshot.docs
      .filter((doc) => !keepIds.includes(doc.id))
      .map((doc) => db.collection("blogs").doc(doc.id).delete());
    await Promise.all(deletePromises);
  }

};