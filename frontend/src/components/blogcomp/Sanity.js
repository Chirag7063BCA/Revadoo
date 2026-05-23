import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

/* ── Brand tokens ── */
export const ORANGE = "#FF6B00";
export const DARK   = "#0A0A0A";
export const BG     = "#F9F7F5";

/* ── Sanity client ── */
export const client = createClient({
  projectId:  "os6cjfhs",
  dataset:    "production",
  apiVersion: "2024-01-01",
  useCdn:     false,
  token:      import.meta.env.VITE_SANITY_TOKEN || "",
});

const builder = createImageUrlBuilder(client);
export const urlFor = (src) => (src ? builder.image(src) : null);

export const getImage = (p, w = 800, h = 500) =>
  p?.mainImage
    ? urlFor(p.mainImage).width(w).height(h).fit("crop").url()
    : p?.img ||
      `https://images.unsplash.com/photo-1551434678-e076c223a692?w=${w}&h=${h}&fit=crop`;

export const fmtDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric",
      })
    : "";

/* ── GROQ query — includes new videoUrl, sidebarText, sidebarLabel fields ── */
export const QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id, title,
  "slug": slug.current,
  desc, mainImage, publishedAt,
  author, avatar,
  tag, tagColor, readTime,
  videoUrl, videoCaption,
  sidebarText, sidebarLabel,
  comingSoon, featured
}`;

export const POST_QUERY = (slug) => `*[_type == "post" && slug.current == $slug][0] {
  _id, title,
  "slug": slug.current,
  desc, body, mainImage, publishedAt,
  author, avatar,
  tag, tagColor, readTime,
  videoUrl, videoCaption,
  sidebarText, sidebarLabel,
  "relatedPosts": *[_type == "post" && slug.current != $slug && tag == ^.tag]
    | order(publishedAt desc)[0..2] {
      _id, title, "slug": slug.current, mainImage, publishedAt, tag
    }
}`;

export const normalizeSanity = (post, idx) => ({
  _isSanity:    true,
  id:           post._id,
  slug:         post.slug,
  category:     post.tag || "General",
  tag:          post.tag || "General",
  title:        post.title,
  excerpt:      post.desc || "",
  author:       post.author || "Revadoo Team",
  _avatar:      post.avatar
                  ? urlFor(post.avatar).width(80).height(80).fit("crop").url()
                  : null,
  date:         fmtDate(post.publishedAt),
  readTime:     post.readTime || "3 min read",
  img:          getImage(post),
  featured:     post.featured || idx === 0,
  videoUrl:     post.videoUrl     || null,
  videoCaption: post.videoCaption || null,
  sidebarText:  post.sidebarText  || [],
  sidebarLabel: post.sidebarLabel || "Quick Tip",
});

export const FALLBACK_POSTS = [
  { id:1,  category:"Getting Started", tag:"Beginner Guide",  title:"How to Earn Your First 1,000 Points in Just 3 Days",                           excerpt:"New to the rewards program? This complete walkthrough shows exactly which tasks to hit first, how to set up your daily streak, and the fastest path to your first real reward redemption.", author:"Riya Sharma",  date:"March 6, 2026",  readTime:"5 min read", img:"https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",  featured:true  },
  { id:2,  category:"Tips & Tricks",   tag:"Power User",      title:"The 7-Day Streak Secret That Triples Your Daily Points",                       excerpt:"Most members miss this one multiplier. Maintaining a 7-day login streak quietly stacks a 3× bonus that almost nobody talks about.", author:"James Okafor", date:"March 4, 2026",  readTime:"4 min read", img:"https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&q=80", featured:false },
  { id:3,  category:"Redeem",          tag:"Gift Cards",       title:"Amazon vs Xbox vs Starbucks: Which Reward Is Actually Worth It?",             excerpt:"We broke down every major reward option by points-to-value ratio, redemption speed, and real-world usability so you never waste a single point.", author:"Priya Nair",  date:"March 2, 2026",  readTime:"6 min read", img:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",  featured:false },
  { id:4,  category:"Quizzes",         tag:"Weekly Challenge", title:"Inside the Daily Quiz: How to Score 100% Every Single Time",                  excerpt:"The daily quiz isn't random — it follows patterns. After analyzing 90 days of questions, we found the topics that repeat most.", author:"Marcus Lee",   date:"Feb 28, 2026",   readTime:"7 min read", img:"https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80", featured:false },
  { id:5,  category:"Mobile",          tag:"App Update",       title:"The Mobile App Just Got Faster — And Added 3 New Earning Modes",              excerpt:"The latest update rolls out background task tracking, push-alert quizzes, and a new partner scan feature.", author:"Sneha Kapoor", date:"Feb 25, 2026",   readTime:"4 min read", img:"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80", featured:false },
  { id:6,  category:"Deep Dive",       tag:"Analysis",         title:"We Tracked 30 Days of Tasks — Here's the Exact Earning Schedule",            excerpt:"We logged every available task across 30 consecutive days and mapped the optimal daily schedule. Spend just 12 minutes a day on this routine.", author:"Riya Sharma",  date:"Feb 22, 2026",   readTime:"9 min read", img:"https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80", featured:false },
  { id:7,  category:"Redeem",          tag:"Sweepstakes",      title:"Sweepstakes Entries: The Highest-ROI Way to Spend Your Points?",             excerpt:"Gift cards feel safe, but sweepstakes entries can return 50× the value if you time them right.", author:"James Okafor", date:"Feb 18, 2026",   readTime:"5 min read", img:"https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80", featured:false },
  { id:8,  category:"Community",       tag:"Member Story",     title:"How This Member Earned $800 in Gift Cards Last Year Without Spending a Penny", excerpt:"Arjun from Bengaluru turned his daily 15-minute reward routine into $800 of real value across Amazon, Starbucks, and Xbox.", author:"Priya Nair",  date:"Feb 14, 2026",   readTime:"8 min read", img:"https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",  featured:false },
  { id:9,  category:"Shopping",        tag:"Bonus Points",     title:"Shop & Earn: Every Store That Gives Bonus Points Right Now",                  excerpt:"The shopping tab is the most underused earning source. This list covers every partner store offering bonus points.", author:"Marcus Lee",   date:"Feb 10, 2026",   readTime:"6 min read", img:"https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80", featured:false },
];