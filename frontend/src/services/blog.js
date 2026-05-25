import { apiUrl } from "./apiConfig";

export const fetchBlogPosts = async () => {
  const response = await fetch(apiUrl("/blog/posts"));
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch blog posts");
  }

  return data.posts || [];
};

export const fetchBlogPostBySlug = async (slug) => {
  const response = await fetch(apiUrl(`/blog/posts/${encodeURIComponent(slug)}`));
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch blog post");
  }

  return data.post || null;
};