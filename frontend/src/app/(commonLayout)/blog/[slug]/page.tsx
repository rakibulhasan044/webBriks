import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBlogPostBySlug, BLOG_POSTS } from "@/lib/blog-data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug);
  if (!post) {
    return { title: "Post Not Found | ZenBoard" };
  }
  return {
    title: `${post.title} | ZenBoard Blog`,
    description: post.excerpt,
  };
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getBlogPostBySlug(resolvedParams.slug);
  
  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>
      
      <div className="mb-10 text-center">
        <div className="flex items-center justify-center gap-3 text-sm font-semibold text-indigo-600 mb-6">
          <span className="bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
            {post.category}
          </span>
          <span className="text-slate-400 font-medium">
            {post.date}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-3 text-slate-700 font-medium">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm">
            {post.author.charAt(0)}
          </div>
          <span>By {post.author}</span>
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden mb-12 bg-slate-100 h-[300px] md:h-[500px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={post.imageUrl} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="prose prose-lg prose-indigo mx-auto text-slate-600 leading-relaxed max-w-3xl">
        <p className="text-xl font-medium text-slate-800 mb-8 leading-relaxed">
          {post.excerpt}
        </p>
        <div className="space-y-6">
          <p>{post.content}</p>
        </div>
      </div>
    </article>
  );
}
