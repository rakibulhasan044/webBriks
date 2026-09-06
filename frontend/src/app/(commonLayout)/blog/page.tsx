import { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog | ZenBoard",
  description: "News, tutorials, and insights from the ZenBoard team.",
};

export default function BlogPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight mb-4">
          ZenBoard Blog
        </h1>
        <p className="text-lg text-slate-500">
          Productivity tips, product updates, and insights on modern teamwork.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="h-48 overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-3 text-xs font-semibold text-indigo-600 mb-3">
                <span className="bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="text-slate-400 font-medium">
                  {post.date}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-slate-500 text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-auto flex items-center gap-2 text-sm font-medium text-slate-900">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
                  {post.author.charAt(0)}
                </div>
                {post.author}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
