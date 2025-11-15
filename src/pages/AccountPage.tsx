import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AddressService } from '@/services/address.service';
import { WishlistService } from '@/services/wishlist.service';
import { OrderService } from '@/services/order.service';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Input } from '@/components/common/Input';
import { Modal } from '@/components/common/Modal';
import { Spinner } from '@/components/common/Spinner';
import { Tabs } from '@/components/common/Tabs';
import { 
  User, 
  Package, 
  MapPin, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  ShoppingBag,
  Heart
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ORDER_STATUS_LABELS } from '@/lib/constants';
import { downloadInvoice } from '@/lib/invoice';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { generateSEOTags, updateMetaTags } from '@/lib/seo';

export default function AccountPage() {
  const { user, logout, updateProfile } = useAuth();
  const { data: orders } = useOrders();
  const navigate = useNavigate();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });
  const [addressForm, setAddressForm] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    address_type: 'home' as 'home' | 'work' | 'other',
  });

  const { data: addresses, refetch: refetchAddresses } = useQuery({
    queryKey: ['user-addresses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await AddressService.getUserAddresses(user.id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!user,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const { error } = await AddressService.deleteAddress(addressId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Address deleted');
      refetchAddresses();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const addAddressMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not logged in');
      const { error } = await AddressService.createAddress({
        user_id: user.id,
        ...addressForm,
      } as any);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Address added');
      setIsAddingAddress(false);
      setAddressForm({
        full_name: user?.full_name || '',
        phone: user?.phone || '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'India',
        address_type: 'home',
      });
      refetchAddresses();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: async () => {
      if (!editingAddressId) throw new Error('No address selected');
      const { error } = await AddressService.updateAddress(editingAddressId, addressForm as any);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Address updated');
      setIsEditingAddress(false);
      setEditingAddressId(null);
      refetchAddresses();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const { error } = await AddressService.setDefaultAddress(addressId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Default address set');
      refetchAddresses();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleUpdateProfile = async () => {
    const { error } = await updateProfile(profileData);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Profile updated successfully');
      setIsEditingProfile(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleDeleteAddress = (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      deleteAddressMutation.mutate(id);
    }
  };

  const handleCancelOrder = async (orderId: string, paymentMethod: string) => {
    if (!confirm('Are you sure you want to cancel this order? Refund will be processed if payment was made.')) {
      return;
    }

    try {
      // Cancel order in database
      const { error } = await OrderService.updateOrderStatus(orderId, 'cancelled');
      if (error) throw new Error(error);

      // If payment was made via Razorpay, initiate refund
      if (paymentMethod === 'razorpay') {
        toast.success('Order cancelled. Refund will be processed within 5-7 business days.');
      } else {
        toast.success('Order cancelled successfully');
      }

      // Refresh orders
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel order');
    }
  };

  useEffect(() => {
    const tags = generateSEOTags({
      title: `My Account | ${import.meta.env.VITE_APP_NAME || 'OnlyThing'}`,
      description: 'View orders, manage addresses, and update your profile.',
      keywords: 'account, dashboard, orders, addresses, onlything',
      image: `${window.location.origin}/L.jpg`,
      url: window.location.href,
      type: 'website',
    });
    updateMetaTags(tags);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const accountTabs = [
    {
      id: 'overview',
      label: 'Overview',
      content: (
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditingProfile(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <p className="text-base font-medium text-gray-900">{user.full_name || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="text-base font-medium text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="text-base font-medium text-gray-900">{user.phone || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Account Type</label>
                <Badge variant={user.role === 'admin' ? 'primary' : 'info'}>
                  {user.role === 'admin' ? 'Admin' : 'Customer'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders?.length || 0}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders?.filter(o => o.status === 'delivered').length || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Saved Addresses</p>
                  <p className="text-2xl font-bold text-gray-900">{addresses?.length || 0}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <Button size="sm" variant="outline" onClick={() => window.location.hash = 'orders'}>
                View All
              </Button>
            </div>

            {orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{order.order_number}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="primary">{ORDER_STATUS_LABELS[order.status]}</Badge>
                        <Button size="xs" variant="outline" onClick={() => downloadInvoice(order)}>
                          Download Invoice
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        {order.items?.length || 0} items
                      </p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No orders yet</p>
                <Link to="/shop" className="mt-2 inline-block">
                  <Button size="sm">Start Shopping</Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      ),
    },
    {
      id: 'orders',
      label: 'Orders',
      content: (
        <div>
          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{order.order_number}</p>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="primary">{ORDER_STATUS_LABELS[order.status]}</Badge>
                      <Button size="xs" variant="outline" onClick={() => downloadInvoice(order)}>
                        Download Invoice
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.product_name} × {item.quantity}</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between">
                    <span className="text-sm text-gray-500">Total Amount</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(order.total)}
                    </span>
                  </div>

                  {/* Cancel Order Button */}
                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleCancelOrder(order.id, order.payment_method)}
                      >
                        Cancel Order
                      </Button>
                    </div>
                  )}

                  {order.tracking_number && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-gray-500">Tracking Number</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {order.tracking_number}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                <Link to="/shop">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      ),
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      content: (
        <WishlistTab userId={user.id} />
      ),
    },
    {
      id: 'addresses',
      label: 'Addresses',
      content: (
        <div>
          <div className="mb-6">
            <Button onClick={() => setIsAddingAddress(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Address
            </Button>
          </div>

          {addresses && addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((address) => (
                <Card key={address.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="font-semibold text-gray-900 capitalize">
                        {address.address_type}
                      </span>
                    </div>
                    {address.is_default && <Badge variant="primary">Default</Badge>}
                  </div>

                  <div className="text-sm text-gray-700 space-y-1 mb-4">
                    <p className="font-medium">{address.full_name}</p>
                    <p>{address.phone}</p>
                    <p>{address.address_line1}</p>
                    {address.address_line2 && <p>{address.address_line2}</p>}
                    <p>
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                    <p>{address.country}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsEditingAddress(true);
                        setEditingAddressId(address.id);
                        setAddressForm({
                          full_name: address.full_name || user.full_name || '',
                          phone: address.phone || user.phone || '',
                          address_line1: address.address_line1 || '',
                          address_line2: address.address_line2 || '',
                          city: address.city || '',
                          state: address.state || '',
                          postal_code: address.postal_code || '',
                          country: address.country || 'India',
                          address_type: (address.address_type || 'home') as 'home' | 'work' | 'other',
                        });
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    {!address.is_default && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDefaultMutation.mutate(address.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No addresses saved</h3>
                <p className="text-gray-600 mb-6">Add a delivery address to get started</p>
                <Button onClick={() => setIsAddingAddress(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Address
                </Button>
              </div>
            </Card>
          )}
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      content: (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Password</h3>
              <Button variant="outline">Change Password</Button>
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Email Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="ml-2 text-sm text-gray-600">Order updates</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="ml-2 text-sm text-gray-600">Promotional emails</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded" />
                  <span className="ml-2 text-sm text-gray-600">Product recommendations</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-sm font-medium text-red-600 mb-3">Danger Zone</h3>
              <Button variant="danger" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.full_name || 'My Account'}</h1>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs tabs={accountTabs} />
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditingProfile}
        onClose={() => setIsEditingProfile(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={profileData.full_name}
            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
          />
          <Input
            label="Phone"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddingAddress}
        onClose={() => setIsAddingAddress(false)}
        title="Add New Address"
      >
        <div className="space-y-4">
          <Input label="Full Name" value={addressForm.full_name} onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })} />
          <Input label="Phone" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} />
          <Input label="Address Line 1" value={addressForm.address_line1} onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })} />
          <Input label="Address Line 2" value={addressForm.address_line2} onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} />
            <Input label="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} />
            <Input label="Postal Code" value={addressForm.postal_code} onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })} />
          </div>
          <Input label="Country" value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} />
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Address Type</label>
            <select
              value={addressForm.address_type}
              onChange={(e) => setAddressForm({ ...addressForm, address_type: e.target.value as any })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsAddingAddress(false)}>Cancel</Button>
            <Button onClick={() => addAddressMutation.mutate()}>
              {addAddressMutation.isPending ? 'Saving...' : 'Save Address'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Address Modal */}
      <Modal
        isOpen={isEditingAddress}
        onClose={() => setIsEditingAddress(false)}
        title="Edit Address"
      >
        <div className="space-y-4">
          <Input label="Full Name" value={addressForm.full_name} onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })} />
          <Input label="Phone" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} />
          <Input label="Address Line 1" value={addressForm.address_line1} onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })} />
          <Input label="Address Line 2" value={addressForm.address_line2} onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} />
            <Input label="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} />
            <Input label="Postal Code" value={addressForm.postal_code} onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })} />
          </div>
          <Input label="Country" value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} />
          <div>
            <label className="text-sm text-gray-700 mb-1 block">Address Type</label>
            <select
              value={addressForm.address_type}
              onChange={(e) => setAddressForm({ ...addressForm, address_type: e.target.value as any })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsEditingAddress(false)}>Cancel</Button>
            <Button onClick={() => updateAddressMutation.mutate()}>
              {updateAddressMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Wishlist Tab Component */}
      {/* Defined below to keep file self-contained */}
    </div>
  );
}

function WishlistTab({ userId }: { userId: string }) {
  const { data: wishlistItems, refetch, isLoading } = useQuery({
    queryKey: ['wishlist', userId],
    queryFn: async () => {
      const { data, error } = await WishlistService.getWishlistItems(userId);
      if (error) throw new Error(error);
      return data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const removeMutation = useMutation({
    mutationFn: async (wishlistItemId: string) => {
      const { error } = await WishlistService.removeFromWishlist(wishlistItemId);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Removed from wishlist');
      refetch();
    },
    onError: (error: any) => toast.error(error.message),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {wishlistItems && wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                  {item.product?.images?.[0]?.image_url ? (
                    <img src={item.product.images[0].image_url} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{item.product?.name}</p>
                      <p className="text-sm text-gray-600">Added {formatDate(item.created_at)}</p>
                    </div>
                    <Button size="xs" variant="ghost" onClick={() => removeMutation.mutate(item.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-medium text-gray-900">{item.product ? formatCurrency(item.product.price) : ''}</p>
                    <Link to={`/product/${item.product?.slug || item.product?.id}`}>
                      <Button size="sm" variant="outline">View Product</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items in wishlist</h3>
            <p className="text-gray-600 mb-6">Browse products and add your favorites</p>
            <Link to="/shop">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}