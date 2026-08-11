import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ChevronRight, ArrowRight } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import BlogCard from "@/components/blog/BlogCard";
import { getBlogBySlugServer, getBlogsServer } from "@/lib/supabase/queries";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const blogs = await getBlogsServer();
  return blogs.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlugServer(slug);

  if (!post) {
    return {
      title: "Blog Post Not Found | Flavour & Co.",
    };
  }

  return {
    title: `${post.title} | Flavour & Co. Journal`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogBySlugServer(slug);

  if (!post || post.published === false) {
    notFound();
  }

  const allBlogs = await getBlogsServer();
  const relatedPosts = allBlogs.filter((p) => p.slug !== post.slug).slice(0, 3);
  const midPoint = Math.floor(post.content.length / 2) || 2;

  return (
    <PageLayout
      title={post.title}
      hideHeader
      fullWidth
    >
      <article className="w-full bg-[#fdf8f3] text-[#1c1410] py-8 sm:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-[#1c1410]/60 mb-6 font-sans">
            <Link href="/" className="hover:text-[#6b1e30] transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-[#c69c40]" />
            <Link href="/blog" className="hover:text-[#6b1e30] transition-colors">
              Blog
            </Link>
            <ChevronRight className="h-3 w-3 text-[#c69c40]" />
            <span className="text-[#6b1e30] font-medium truncate max-w-[200px] sm:max-w-[300px]">
              {post.title}
            </span>
          </nav>

          {/* Article Header Card */}
          <header className="space-y-4 text-left mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1c1410] leading-[1.18] tracking-tight">
              {post.title}
            </h1>

            {/* Author Meta Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#ebe3d8] text-sm text-[#1c1410]/80">
              <div className="flex items-center gap-2 text-sm font-sans font-medium text-[#1c1410]">
                <span>By {post.writer}</span>
              </div>

              <div className="flex items-center gap-3 text-xs font-sans text-[#1c1410]/60">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-[#c69c40]" />
                  {post.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-[#c69c40]" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </header>

          {/* Main Full Image */}
          <div className="w-full overflow-hidden rounded-2xl shadow-lg border border-[#c69c40]/30 mb-10 bg-stone-100">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto object-cover"
              loading="eager"
            />
          </div>

          {/* Article Body Content */}
          <div className="prose prose-lg max-w-none text-[#1c1410] font-serif leading-relaxed text-base sm:text-lg space-y-6">
            {post.content.map((paragraph, idx) => {
              const isQuote = paragraph.startsWith("“") || paragraph.startsWith("\"") || paragraph.startsWith("Picture the warmth");
              
              return (
                <div key={idx} className="space-y-6">
                  {idx === 0 ? (
                    <p className="font-serif text-lg sm:text-xl font-medium italic text-[#6b1e30] leading-relaxed border-l-4 border-[#c69c40] pl-4 sm:pl-6 py-1 bg-[#f7efe6]/60 rounded-r-lg">
                      {paragraph}
                    </p>
                  ) : isQuote && idx === 1 ? (
                    <blockquote className="font-serif italic text-xl sm:text-2xl text-stone-800 border-l-4 border-[#6b1e30] pl-6 my-6 py-2 bg-white/80 rounded-r-xl shadow-xs">
                      {paragraph}
                    </blockquote>
                  ) : (
                    <p className="text-stone-800 leading-relaxed font-sans sm:font-serif">
                      {paragraph}
                    </p>
                  )}

                  {post.image2 && idx === midPoint - 1 && (
                    <div className="my-10 w-full overflow-hidden rounded-2xl shadow-md border border-[#c69c40]/25 bg-stone-100">
                      <img
                        src={post.image2}
                        alt={`${post.title} detail view`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Related Articles Footer */}
          {relatedPosts.length > 0 && (
            <footer className="mt-16 sm:mt-24 pt-10 border-t border-[#ebe3d8] space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1410]">
                  More Stories &amp; Insights
                </h3>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6b1e30] hover:text-[#c69c40] transition-colors"
                >
                  View All Journal Articles <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((rPost) => (
                  <BlogCard key={rPost.id} post={rPost} />
                ))}
              </div>
            </footer>
          )}

        </div>
      </article>
    </PageLayout>
  );
}
