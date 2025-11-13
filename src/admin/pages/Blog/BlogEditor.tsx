import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Save, X, Upload, ArrowLeft, Eye, FileText, Image as ImageIcon 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { StorageService } from '@/services/storage.service';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Spinner } from '@/components/common/Spinner';
import toast from 'react-hot-toast';

const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(5, 'Slug must be at least 5 characters'),
  excerpt: z.string().optional(),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  is_featured: z.boolean().default(false),
});

type BlogFormData = z.infer<typeof blogSchema>;

export function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: 'draft',
      is_featured: false,
    },
  });

  const title = watch('title');
  const content = watch('content');

  useEffect(() => {
    if (isEdit) {
      loadPost();
    }
  }, [id]);

  useEffect(() => {
    if (title && !isEdit) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', slug);
    }
  }, [title, isEdit, setValue]);

  const loadPost = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      Object.keys(data).forEach((key) => {
        if (key !== 'featured_image') {
          setValue(key as any, data[key]);
        }
      });

      if (data.featured_image) {
        setFeaturedImage(data.featured_image);
      }
    } catch (error) {
      toast.error('Failed to load post');
      navigate('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setFeaturedImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    try {
      setLoading(true);

      let uploadedImageUrl = featuredImage;

      // Upload featured image if new file selected
      if (imageFile) {
        setUploading(true);
        const { url } = await StorageService.uploadFile(imageFile, 'blog');
        uploadedImageUrl = url;
      }

      const postData = {
        ...data,
        featured_image: uploadedImageUrl,
        updated_at: new Date().toISOString(),
      };

      if (isEdit) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Post updated successfully');
      } else {
        // Get current user for author_id
        const { data: { user } } = await supabase.auth.getUser();
        
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            ...postData,
            author_id: user?.id,
            published_at: data.status === 'published' ? new Date().toISOString() : null,
          });

        if (error) throw error;
        toast.success('Post created successfully');
      }

      navigate('/admin/blog');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save post');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/blog')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Edit Post' : 'New Blog Post'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? 'Update blog post' : 'Create a new blog post'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Post Content
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <Input
                    {...register('title')}
                    placeholder="Enter post title"
                    error={errors.title?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <Input
                    {...register('slug')}
                    placeholder="post-slug"
                    error={errors.slug?.message}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly version of the title
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Excerpt
                  </label>
                  <Textarea
                    {...register('excerpt')}
                    rows={3}
                    placeholder="Brief summary of the post"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Short description shown in post listings
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <Textarea
                    {...register('content')}
                    rows={20}
                    placeholder="Write your blog post content here..."
                    error={errors.content?.message}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supports Markdown formatting. {content?.length || 0} characters
                  </p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Featured Image
              </h2>

              {featuredImage && (
                <div className="mb-4">
                  <img
                    src={featuredImage}
                    alt="Featured"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedImage('');
                      setImageFile(null);
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Image
                  </button>
                </div>
              )}

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload featured image</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            </div>

            {/* SEO */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                SEO Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Title
                  </label>
                  <Input
                    {...register('meta_title')}
                    placeholder="SEO title for search engines"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If empty, post title will be used
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Description
                  </label>
                  <Textarea
                    {...register('meta_description')}
                    rows={3}
                    placeholder="SEO description for search engines"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    If empty, excerpt will be used
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Publish</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('is_featured')}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Featured Post</span>
                </label>

                <div className="pt-4 border-t space-y-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || uploading}
                  >
                    {loading || uploading ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        {uploading ? 'Uploading...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {isEdit ? 'Update Post' : 'Create Post'}
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => navigate('/admin/blog')}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Title</p>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {title || 'No title yet'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Content Length</p>
                  <p className="text-sm text-gray-900">
                    {content?.length || 0} characters
                  </p>
                </div>
                {featuredImage && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Featured Image</p>
                    <img
                      src={featuredImage}
                      alt="Preview"
                      className="w-full h-20 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Writing Tips */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">
                Writing Tips
              </h3>
              <ul className="text-xs text-blue-800 space-y-2">
                <li>• Use clear, descriptive titles</li>
                <li>• Write engaging introductions</li>
                <li>• Break content into sections</li>
                <li>• Use images to illustrate points</li>
                <li>• Optimize for SEO keywords</li>
                <li>• Proofread before publishing</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}