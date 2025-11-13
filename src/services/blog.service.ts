import { supabase } from '@/lib/supabase';
import type { BlogPost, BlogPostWithAuthor, BlogCategory, CreateBlogPostDTO, UpdateBlogPostDTO } from '@/types';

export const BlogService = {
  // Get published blog posts
  async getPublishedPosts(page: number = 1, limit: number = 12) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(*),
          categories:blog_post_categories(category:blog_categories(*))
        `, { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return { data: data as BlogPostWithAuthor[], count: count || 0, error: null };
    } catch (error: any) {
      return { data: [], count: 0, error: error.message };
    }
  },

  // Get blog post by slug
  async getPostBySlug(slug: string) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(*),
          categories:blog_post_categories(category:blog_categories(*))
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) throw error;

      // Increment view count
      await supabase
        .from('blog_posts')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id);

      return { data: data as BlogPostWithAuthor, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Get featured posts
  async getFeaturedPosts(limit: number = 3) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(*)
        `)
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return { data: data as BlogPostWithAuthor[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  // Get blog categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      return { data: data as BlogCategory[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  // Get posts by category
  async getPostsByCategory(categorySlug: string, page: number = 1, limit: number = 12) {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      // First get category ID
      const { data: category } = await supabase
        .from('blog_categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

      if (!category) {
        return { data: [], count: 0, error: 'Category not found' };
      }

      const { data, error, count } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(*),
          categories:blog_post_categories!inner(category:blog_categories(*))
        `, { count: 'exact' })
        .eq('status', 'published')
        .eq('blog_post_categories.category_id', category.id)
        .order('published_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return { data: data as BlogPostWithAuthor[], count: count || 0, error: null };
    } catch (error: any) {
      return { data: [], count: 0, error: error.message };
    }
  },

  // ADMIN: Get all posts
  async getAllPosts(includeUnpublished: boolean = true) {
    try {
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(*),
          categories:blog_post_categories(category:blog_categories(*))
        `)
        .order('created_at', { ascending: false });

      if (!includeUnpublished) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: data as BlogPostWithAuthor[], error: null };
    } catch (error: any) {
      return { data: [], error: error.message };
    }
  },

  // ADMIN: Create blog post
  async createPost(postData: CreateBlogPostDTO, authorId: string) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: postData.title,
          slug: postData.slug,
          excerpt: postData.excerpt,
          content: postData.content,
          featured_image: postData.featured_image,
          author_id: authorId,
          meta_title: postData.meta_title,
          meta_description: postData.meta_description,
          status: postData.status || 'draft',
          is_featured: postData.is_featured || false,
        })
        .select()
        .single();

      if (error) throw error;

      // Add categories
      if (postData.category_ids && postData.category_ids.length > 0) {
        const categoryRelations = postData.category_ids.map(catId => ({
          blog_post_id: data.id,
          category_id: catId,
        }));

        await supabase
          .from('blog_post_categories')
          .insert(categoryRelations);
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Update blog post
  async updatePost(postId: string, updates: Partial<UpdateBlogPostDTO>) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      // Update categories if provided
      if (updates.category_ids) {
        // Remove old categories
        await supabase
          .from('blog_post_categories')
          .delete()
          .eq('blog_post_id', postId);

        // Add new categories
        if (updates.category_ids.length > 0) {
          const categoryRelations = updates.category_ids.map(catId => ({
            blog_post_id: postId,
            category_id: catId,
          }));

          await supabase
            .from('blog_post_categories')
            .insert(categoryRelations);
        }
      }

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Delete blog post
  async deletePost(postId: string) {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // ADMIN: Publish post
  async publishPost(postId: string) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Unpublish post
  async unpublishPost(postId: string) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update({ status: 'draft' })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // ADMIN: Create category
  async createCategory(name: string, slug: string) {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .insert({ name, slug })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },
};