import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BlogService } from '@/services/blog.service';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Spinner } from '@/components/common/Spinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Plus, Edit, Trash2, Eye, FileText, ArrowLeft } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export const BlogListPage = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await BlogService.getAllPosts(true);
      if (error) throw new Error(error);
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await BlogService.deletePost(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Post deleted successfully');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await BlogService.publishPost(id);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Post published successfully');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    deleteMutation.mutate(id);
  };

  const handlePublish = (id: string) => {
    publishMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your blog content</p>
            </div>
            <div className="flex gap-3">
              <Link to="/admin">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Link to="/admin/blog/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!data || data.length === 0 ? (
          <Card className="p-12">
            <EmptyState
              icon={<FileText className="w-16 h-16 text-gray-400" />}
              title="No blog posts yet"
              description="Create your first blog post to get started"
              action={
                <Link to="/admin/blog/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </Link>
              }
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {data.map((post) => (
              <Card key={post.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {post.title}
                      </h3>
                      <Badge
                        variant={
                          post.status === 'published'
                            ? 'success'
                            : post.status === 'draft'
                            ? 'warning'
                            : 'error'
                        }
                      >
                        {post.status}
                      </Badge>
                      {post.is_featured && <Badge variant="primary">Featured</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {post.excerpt || 'No excerpt'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>By {post.author?.full_name || 'Unknown'}</span>
                      <span>•</span>
                      <span>{formatDate(post.created_at)}</span>
                      {post.published_at && (
                        <>
                          <span>•</span>
                          <span>Published {formatDate(post.published_at)}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{post.view_count} views</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {post.status === 'draft' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePublish(post.id)}
                        isLoading={publishMutation.isPending}
                      >
                        Publish
                      </Button>
                    )}
                    <Link to={`/blog/${post.slug}`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to={`/admin/blog/edit/${post.id}`}>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(post.id)}
                      isLoading={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};