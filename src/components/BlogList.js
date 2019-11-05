import Link from "next/link";
import blogListStyles from "../styles/components/bloglist.scss";
import matter from "gray-matter";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const BlogList = () => {

  function getPosts() {
    //get posts & context from folder
    const posts = (ctx => {
      const keys = ctx.keys();
      const values = keys.map(ctx);
      const data = keys.map((key, index) => {
        // Create slug from filename
        const slug = key
          .replace(/^.*[\\\/]/, "")
          .split(".")
          .slice(0, -1)
          .join(".");
        const value = values[index];
        // Parse yaml metadata in document
        const document = matter(value.default);
        return {
          document,
          slug
        };
      });
      return data;
    })(require.context("../posts", true, /\.md$/));
    return posts;
  }

  function truncateSummary(content) {
    return content.slice(0, 200).trimEnd();
  }

  function reformatDate(fullDate) {
    const date = new Date(fullDate)
    return date.toDateString().slice(4);
  }

  function renderPosts(posts) {
    return posts.map(post => (
      <Link
        key={post.slug}
        href={{ pathname: `/blog/${post.slug}` }}
      >
        <a>
        <li className={blogListStyles.li}>
         
          <div className={blogListStyles.hero_image}>
            <img src={post.document.data.hero_image} />
          </div>
          <div className={blogListStyles.blog__info}>
            <h2>{post.document.data.title}</h2>
            <h3> {reformatDate(post.document.data.date)}</h3>
            <ReactMarkdown source={truncateSummary(post.document.content)} />
          </div>
          
        </li>
        </a>
      </Link>
    ));
  }

  //store the posts in state with hook
  const [posts] = useState(getPosts());

  return (
    <ul className={blogListStyles.list}>
      {posts.length > 1 && renderPosts(posts)}
    </ul>
  );
};

export default BlogList;
