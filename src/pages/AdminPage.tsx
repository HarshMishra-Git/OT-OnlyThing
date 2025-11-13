import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
}

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export function AdminPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: 'skincare',
    stock_quantity: '0',
    image_url: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800',
  });

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    fetchData();
  }, [user, activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const { data } = await supabase
          .from('products')
          .select('id, name, price, stock_quantity, is_active')
          .order('created_at', { ascending: false });
        setProducts(data || []);
      } else {
        const { data } = await supabase
          .from('orders')
          .select('id, order_number, total_amount, status, created_at')
          .order('created_at', { ascending: false });
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('products').insert({
        name: newProduct.name,
        slug: newProduct.slug,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        stock_quantity: parseInt(newProduct.stock_quantity),
        image_url: newProduct.image_url,
        is_active: true,
      });

      if (error) throw error;

      setNewProduct({
        name: '',
        slug: '',
        description: '',
        price: '',
        category: 'skincare',
        stock_quantity: '0',
        image_url: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800',
      });

      fetchData();
      alert('Product added successfully');
    } catch (error: any) {
      alert(error.message || 'Failed to add product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleToggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-black mb-12 tracking-tight">
          ADMIN DASHBOARD
        </h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-bold border-2 transition-colors ${
              activeTab === 'products'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-gray-300 hover:border-black'
            }`}
          >
            PRODUCTS
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-bold border-2 transition-colors ${
              activeTab === 'orders'
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-gray-300 hover:border-black'
            }`}
          >
            ORDERS
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="space-y-8">
            <div className="border-2 border-black p-8">
              <h2 className="text-2xl font-black mb-6">ADD NEW PRODUCT</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Product Name</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Slug</label>
                    <input
                      type="text"
                      required
                      value={newProduct.slug}
                      onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none"
                      placeholder="product-name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Price</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none"
                    >
                      <option value="skincare">Skincare</option>
                      <option value="wellness">Wellness</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Stock</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock_quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2">Image URL</label>
                  <input
                    type="url"
                    required
                    value={newProduct.image_url}
                    onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none"
                  />
                </div>

                <Button type="submit">Add Product</Button>
              </form>
            </div>

            <div className="border-2 border-black p-8">
              <h2 className="text-2xl font-black mb-6">MANAGE PRODUCTS</h2>
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex justify-between items-center border-2 border-gray-200 p-4">
                      <div>
                        <p className="font-bold">{product.name}</p>
                        <p className="text-sm text-gray-600">
                          ₹{product.price.toFixed(2)} | Stock: {product.stock_quantity}
                        </p>
                      </div>
                      <Button
                        variant={product.is_active ? 'secondary' : 'primary'}
                        onClick={() => handleToggleProductStatus(product.id, product.is_active)}
                      >
                        {product.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No products found</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="border-2 border-black p-8">
            <h2 className="text-2xl font-black mb-6">MANAGE ORDERS</h2>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border-2 border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-lg">{order.order_number}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('en-IN')}
                        </p>
                        <p className="text-xl font-black mt-2">₹{order.total_amount.toFixed(2)}</p>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="px-4 py-2 border-2 border-gray-300 focus:border-black focus:outline-none font-bold"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No orders found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
