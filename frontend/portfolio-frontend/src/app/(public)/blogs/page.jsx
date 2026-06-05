import BlogsClient from "./BlogsClient";

const BlogsPage = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const response = await fetch(`${baseUrl}/blogs`);
  const blogs = response.ok ? await response.json() : [];

  return (
    <section className="w-full">
      <BlogsClient initialBlogs={Array.isArray(blogs) ? blogs : []} />
    </section>
  );
};

export default BlogsPage;