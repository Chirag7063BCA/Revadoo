import React from 'react'
import Blog from '../components/blogcomp/Blog'
import BlogHero from '../components/blogcomp/Bloghero'
import BlogStats from '../components/blogcomp/Blogstats'
import BlogGrid from '../components/blogcomp/Bloggrid'
import BlogDeepDive from '../components/blogcomp/Blogdeepdive'
import BlogNewsletter from '../components/blogcomp/Blognewsletter'
import BlogCTA from '../components/blogcomp/Blogcta'


const BlogPage = () => {
  return (
    <div>
      <Blog />
      <BlogHero />
      <BlogStats />
      <BlogGrid />
      <BlogDeepDive />
      <BlogNewsletter />
      <BlogCTA />
    </div>
  )
}

export default BlogPage
