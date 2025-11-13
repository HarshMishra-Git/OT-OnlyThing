import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductService } from '@/services/product.service';
import { CategoryService } from '@/services/category.service';
import { StorageService } from '@/services/storage.service';
import { productSchema, type ProductInput } from '@/lib/validators';
import { slugify } from '@/lib/utils';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Select } from '@/components/common/Select';
import { Card } from '@/components/common/Card';
import { ArrowLeft, Upload } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await CategoryService.getAllCategories();
      return data || [];
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      is_active: true,
      is_featured: false,
      stock_quantity: 0,
    },
  });

  const nameValue = watch('name');

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue('name', name);
    if (!id) {
      setValue('slug', slugify(name));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const { url, error } = await StorageService.uploadProductImage(file);
    setUploadingImage(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Image uploaded');
      // You can store the URL and use it when creating product
    }
  };

  const onSubmit = async (data: ProductInput) => {
    setIsSubmitting(true);

    try {
      if (id) {
        const { error } = await ProductService.updateProduct(id, data);
        if (error) throw new Error(error);
        toast.success('Product updated successfully');
      } else {
        const { error } = await ProductService.createProduct(data);
        if (error) throw new Error(error);
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
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
                {id ? 'Edit Product' : 'Add New Product'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {id ? 'Update product details' : 'Create a new product'}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin/products')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <Input
                label="Product Name"
                placeholder="e.g. Premium Wireless Headphones"
                {...register('name')}
                onChange={handleNameChange}
                error={errors.name?.message}
                required
              />

              <Input
                label="Slug"
                placeholder="premium-wireless-headphones"
                {...register('slug')}
                error={errors.slug?.message}
                helperText="URL-friendly version of the name"
                required
              />

              <Textarea
                label="Short Description"
                placeholder="Brief product description"
                rows={2}
                {...register('short_description')}
                error={errors.short_description?.message}
              />

              <Textarea
                label="Full Description"
                placeholder="Detailed product description"
                rows={6}
                {...register('description')}
                error={errors.description?.message}
              />
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Price"
                type="number"
                step="0.01"
                placeholder="999.00"
                {...register('price', { valueAsNumber: true })}
                error={errors.price?.message}
                required
              />

              <Input
                label="Compare Price"
                type="number"
                step="0.01"
                placeholder="1299.00"
                {...register('compare_price', { valueAsNumber: true })}
                error={errors.compare_price?.message}
                helperText="Original price if on sale"
              />

              <Input
                label="SKU"
                placeholder="PROD-001"
                {...register('sku')}
                error={errors.sku?.message}
              />

              <Input
                label="Stock Quantity"
                type="number"
                placeholder="100"
                {...register('stock_quantity', { valueAsNumber: true })}
                error={errors.stock_quantity?.message}
                required
              />
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization</h2>
            
            <div className="space-y-4">
              <Select
                label="Category"
                options={[
                  { value: '', label: 'Select a category' },
                  ...(categories?.map(cat => ({
                    value: cat.id,
                    label: cat.name
                  })) || [])
                ]}
                {...register('category_id')}
                error={errors.category_id?.message}
              />

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('is_active')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('is_featured')}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-1">
                  Click to upload product images
                </p>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
              </label>
              {uploadingImage && <p className="text-sm text-gray-600 mt-2">Uploading...</p>}
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
            
            <div className="space-y-4">
              <Input
                label="Meta Title"
                placeholder="Product Name | Your Store"
                {...register('meta_title')}
                error={errors.meta_title?.message}
                helperText="Max 60 characters"
              />

              <Textarea
                label="Meta Description"
                placeholder="Brief description for search engines"
                rows={3}
                {...register('meta_description')}
                error={errors.meta_description?.message}
                helperText="Max 160 characters"
              />
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {id ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};