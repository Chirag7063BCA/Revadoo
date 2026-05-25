const express = require("express");

const router = express.Router();

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || "os6cjfhs";
const SANITY_DATASET = process.env.SANITY_DATASET || "production";
const SANITY_API_VERSION = process.env.SANITY_API_VERSION || "2024-01-01";
const SANITY_READ_TOKEN = process.env.SANITY_READ_TOKEN || process.env.SANITY_TOKEN || "";

const BLOG_LIST_QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id, title,
  "slug": slug.current,
  desc, mainImage, publishedAt,
  author, avatar,
  tag, tagColor, readTime,
  videoUrl, videoCaption,
  sidebarText, sidebarLabel,
  comingSoon, featured
}`;

const BLOG_POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
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

function buildSanityUrl(query, params = {}) {
  const url = new URL(
    `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`,
  );

  url.searchParams.set("query", query);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

async function fetchSanityQuery(query, params = {}) {
  const response = await fetch(buildSanityUrl(query, params), {
    headers: SANITY_READ_TOKEN
      ? { Authorization: `Bearer ${SANITY_READ_TOKEN}` }
      : undefined,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.error?.description || payload?.message || `Sanity request failed (${response.status})`;
    throw new Error(message);
  }

  return payload.result;
}

router.get("/posts", async (req, res) => {
  try {
    const posts = await fetchSanityQuery(BLOG_LIST_QUERY);
    return res.json({ posts: Array.isArray(posts) ? posts : [] });
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: error.message || "Failed to fetch blog posts",
    });
  }
});

router.get("/posts/:slug", async (req, res) => {
  try {
    const post = await fetchSanityQuery(BLOG_POST_QUERY, { slug: req.params.slug });
    return res.json({ post: post || null });
  } catch (error) {
    return res.status(502).json({
      success: false,
      message: error.message || "Failed to fetch blog post",
    });
  }
});

module.exports = router;