import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Save, X, Upload, Trash2, Plus, ArrowLeft, 
  Image as ImageIcon, DollarSign, Package 
} from 'lucide-react';
import { ProductService } from '@/services/product.service';
import { CategoryService } from '@/services/category.service';
import { StorageService } from '@/services/storage.service';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import { Spinner } from '@/components/common/Spinner';
import toast from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  short_description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  compare_price: z.number().optional(),
  cost_price: z.number().optional(),
  sku: z.string().min(1, 'SKU is required'),
  stock_quantity: z.number().min(0, 'Stock must be non-negative'),
  low_stock_threshold: z.number().default(10),
  category_id: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  is_active: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Specification {
  key: string;
  value: string;
}

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const name = watch('name');

  useEffect(() => {
    loadCategories();
    if (isEdit) {
      loadProduct();
    }
  }, [id]);

  useEffect(() => {
    if (name && !isEdit) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setValue('slug', slug);
    }
  }, [name, isEdit, setValue]);

  const loadCategories = async () => {
    try {
      const data = await CategoryService.getCategories();
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  const loadProduct = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const product = await ProductService.getProductById(id);
      
      // Set form values
      Object.keys(product).forEach((key) => {
        setValue(key as any, product[key]);
      });

      // Load specifications
      if (product.specifications) {
        setSpecifications(product.specifications);
      }

      // Load images
      if (product.images) {
        setExistingImages(product.images);
      }
    } catch (error) {
      toast.error('Failed to load product');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages([...images, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: string) => {
    try {
      await ProductService.deleteProductImage(imageId);
      setExistingImages(existingImages.filter(img => img.id !== imageId));
      toast.success('Image deleted');
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);

      let productId = id;

      // Create or update product
      if (isEdit) {
        await ProductService.updateProduct(id!, data);
        toast.success('Product updated successfully');
      } else {
        const newProduct = await ProductService.createProduct(data);
        productId = newProduct.id;
        toast.success('Product created successfully');
      }

      // Upload images
      if (images.length > 0) {
        setUploadingImages(true);
        await ProductService.uploadProductImages(productId!, images);
      }

      // Update specifications
      if (specifications.length > 0) {
        await ProductService.updateProductSpecifications(productId!, specifications);
      }

      navigate('/admin/products');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
      setUploadingImages(false);
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
            onClick={() => navigate('/admin/products')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? 'Update product information' : 'Create a new product'}
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <Input
                    {...register('name')}
                    placeholder="Enter product name"
                    error={errors.name?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug *
                  </label>
                  <Input
                    {...register('slug')}
                    placeholder="product-slug"
                    error={errors.slug?.message}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL-friendly version of the name
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <Textarea
                    {...register('description')}
                    rows={6}
                    placeholder="Enter detailed product description"
                    error={errors.description?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Short Description
                  </label>
                  <Textarea
                    {...register('short_description')}
                    rows={3}
                    placeholder="Brief description for listings"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    placeholder="0.00"
                    error={errors.price?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compare Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('compare_price', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">Original price (for discounts)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register('cost_price', { valueAsNumber: true })}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">Your cost</p>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Inventory
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU *
                  </label>
                  <Input
                    {...register('sku')}
                    placeholder="PROD-001"
                    error={errors.sku?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <Input
                    type="number"
                    {...register('stock_quantity', { valueAsNumber: true })}
                    placeholder="0"
                    error={errors.stock_quantity?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Low Stock Alert
                  </label>
                  <Input
                    type="number"
                    {...register('low_stock_threshold', { valueAsNumber: true })}
                    placeholder="10"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Product Images
              </h2>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {existingImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.image_url}
                        alt={img.alt_text}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(img.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {img.is_primary && (
                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* New Images */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload images</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            </div>

            {/* Specifications */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Specifications
                </h2>
                <Button type="button" variant="secondary" onClick={addSpecification}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Spec
                </Button>
              </div>

              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-3">
                    <Input
                      placeholder="Key (e.g., Material)"
                      value={spec.key}
                      onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value (e.g., Stainless Steel)"
                      value={spec.value}
                      onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                {specifications.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No specifications added yet
                  </p>
                )}
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                SEO Information
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
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('is_active')}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Active (visible to customers)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('is_featured')}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">Featured Product</span>
                </label>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Category</h2>
              <select
                {...register('category_id')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || uploadingImages}
                >
                  {loading || uploadingImages ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      {uploadingImages ? 'Uploading Images...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEdit ? 'Update Product' : 'Create Product'}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => navigate('/admin/products')}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}