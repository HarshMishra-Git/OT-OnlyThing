import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  author: string;
}

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, featured_image, published_at, author')
          .eq('is_published', true)
          .order('published_at', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      {/* Hero */}
      <div className="relative h-96 bg-gradient-to-br from-pink-900 to-orange-900 text-white flex items-center justify-center overflow-hidden mb-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <BookOpen size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">
            BLOG
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto px-4">
            Insights, research, and expert advice on skincare science and wellness
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {loading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold">Loading articles...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <a
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white border-2 border-gray-200 rounded-xl hover:border-black hover:shadow-2xl transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms`, animation: 'fadeIn 0.5s ease-out' }}
              >
                {post.featured_image && (
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(post.published_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    {post.author && (
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        {post.author}
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-black group-hover:text-gray-700 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                  )}
                  <div className="flex items-center gap-2 text-sm font-bold text-black group-hover:gap-4 transition-all pt-2">
                    Read More
                    <ArrowRight size={16} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-gray-300 rounded-xl">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <BookOpen size={40} className="text-gray-400" />
            </div>
            <p className="text-xl text-gray-500 mb-4 font-bold">No articles published yet</p>
            <p className="text-sm text-gray-400">Check back soon for skincare insights and research</p>
          </div>
        )}

        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
