import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { ShareButtons } from '@/components/common/ShareButtons';
import { Spinner } from '@/components/common/Spinner';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  author?: { full_name: string };
  view_count: number;
}

export function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*, author:profiles(full_name)')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (error) throw error;
        setPost(data);

        // Increment view count
        if (data) {
          await supabase
            .from('blog_posts')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', data.id);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post not found</h1>
          <button onClick={() => navigate('/blog')} className="text-blue-600 hover:underline">
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <article className="max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-8"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </button>

        {post.featured_image && (
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-96 object-cover rounded-xl mb-8"
          />
        )}

        <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

        <div className="flex items-center gap-6 text-sm text-gray-600 mb-8 pb-8 border-b">
          {post.author?.full_name && (
            <div className="flex items-center gap-2">
              <User size={16} />
              {post.author.full_name}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {new Date(post.published_at).toLocaleDateString('en-IN', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            {Math.ceil(post.content.length / 1000)} min read
          </div>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          {post.content.split('\n').map((paragraph, idx) => (
            <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold mb-4">Share this article</h3>
          <ShareButtons url={window.location.href} title={post.title} />
        </div>
      </article>
    </div>
  );
}
