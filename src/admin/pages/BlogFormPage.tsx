import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BlogService } from '@/services/blog.service';
import { blogPostSchema, type BlogPostInput } from '@/lib/validators';
import { slugify } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Card } from '@/components/common/Card';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const BlogFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      status: 'draft',
      is_featured: false,
    },
  });

  const nameValue = watch('title');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue('title', title);
    if (!id) {
      setValue('slug', slugify(title));
    }
  };

  const onSubmit = async (data: BlogPostInput) => {
    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    setIsSubmitting(true);

    try {
      if (id) {
        const { error } = await BlogService.updatePost(id, data);
        if (error) throw new Error(error);
        toast.success('Post updated successfully');
      } else {
        const { error } = await BlogService.createPost(data, user.id);
        if (error) throw new Error(error);
        toast.success('Post created successfully');
      }
      navigate('/admin/blog');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {id ? 'Edit Post' : 'New Blog Post'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {id ? 'Update post content' : 'Create a new blog post'}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin/blog')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Post Details</h2>

            <div className="space-y-4">
              <Input
                label="Title"
                placeholder="Enter post title"
                {...register('title')}
                onChange={handleTitleChange}
                error={errors.title?.message}
                required
              />

              <Input
                label="Slug"
                placeholder="post-url-slug"
                {...register('slug')}
                error={errors.slug?.message}
                helperText="URL-friendly version of the title"
                required
              />

              <Textarea
                label="Excerpt"
                placeholder="Brief description of the post"
                rows={3}
                {...register('excerpt')}
                error={errors.excerpt?.message}
              />

              <Textarea
                label="Content"
                placeholder="Write your post content here..."
                rows={15}
                {...register('content')}
                error={errors.content?.message}
                required
              />

              <Input
                label="Featured Image URL"
                placeholder="https://example.com/image.jpg"
                {...register('featured_image')}
                error={errors.featured_image?.message}
              />
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>

            <div className="space-y-4">
              <Input
                label="Meta Title"
                placeholder="Post Title | Your Blog"
                {...register('meta_title')}
                error={errors.meta_title?.message}
              />

              <Textarea
                label="Meta Description"
                placeholder="Brief description for search engines"
                rows={3}
                {...register('meta_description')}
                error={errors.meta_description?.message}
              />
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="draft"
                    {...register('status')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Save as Draft</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    value="published"
                    {...register('status')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Publish Now</span>
                </label>
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('is_featured')}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">Feature this post</span>
              </label>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/blog')}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {id ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};