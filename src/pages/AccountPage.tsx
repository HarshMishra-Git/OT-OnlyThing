import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { signOut } from '../lib/auth';
import { Button } from '../components/Button';
import { User, Package, MapPin, Heart, Settings, LogOut } from 'lucide-react';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'settings'>('orders');

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login';
      return;
    }

    if (user) {
      fetchAccountData();
    }
  }, [user, authLoading]);

  async function fetchAccountData() {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .maybeSingle();

      setProfile(profileData);

      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, order_number, total_amount, status, created_at')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error fetching account data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'orders' as const, label: 'Orders', icon: Package },
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'addresses' as const, label: 'Addresses', icon: MapPin },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
              MY ACCOUNT
            </h1>
            <p className="text-gray-600">Welcome back, {profile?.full_name || user?.email}</p>
          </div>
          <Button variant="secondary" onClick={handleSignOut} className="flex items-center gap-2">
            <LogOut size={18} />
            Sign Out
          </Button>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b-2 border-gray-200">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-bold border-b-4 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-black'
                  }`}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white border-2 border-black rounded-xl p-8">
              <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                <Package size={32} />
                ORDER HISTORY
              </h2>
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Package size={40} className="text-gray-400" />
                  </div>
                  <p className="text-xl text-gray-500 mb-6 font-bold">No orders yet</p>
                  <Button onClick={() => (window.location.href = '/shop')}>
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border-2 border-gray-200 rounded-lg p-6 hover:border-black hover:shadow-lg transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-black text-xl mb-1">{order.order_number}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-2xl mb-1">₹{order.total_amount.toFixed(2)}</p>
                          <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white border-2 border-black rounded-xl p-8">
              <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                <User size={32} />
                PROFILE INFORMATION
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-600">Full Name</label>
                  <p className="px-4 py-3 border-2 border-gray-200 rounded-lg font-bold">
                    {profile?.full_name || 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-600">Email</label>
                  <p className="px-4 py-3 border-2 border-gray-200 rounded-lg font-bold">
                    {profile?.email || user?.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-600">Phone</label>
                  <p className="px-4 py-3 border-2 border-gray-200 rounded-lg font-bold">
                    {profile?.phone || 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-600">Member Since</label>
                  <p className="px-4 py-3 border-2 border-gray-200 rounded-lg font-bold">
                    {new Date(user?.created_at || '').toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <Button variant="secondary">Edit Profile</Button>
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white border-2 border-black rounded-xl p-8">
              <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                <MapPin size={32} />
                SAVED ADDRESSES
              </h2>
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <MapPin size={40} className="text-gray-400" />
                </div>
                <p className="text-xl text-gray-500 mb-6 font-bold">No saved addresses</p>
                <Button>Add New Address</Button>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white border-2 border-black rounded-xl p-8">
              <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                <Settings size={32} />
                ACCOUNT SETTINGS
              </h2>
              <div className="space-y-6">
                <div className="border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-black mb-3">Email Notifications</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5" defaultChecked />
                    <span className="text-sm">Receive order updates and promotions</span>
                  </label>
                </div>
                <div className="border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-black mb-3">Privacy</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5" defaultChecked />
                    <span className="text-sm">Allow personalized recommendations</span>
                  </label>
                </div>
                <div className="border-2 border-red-200 rounded-lg p-6">
                  <h3 className="text-xl font-black mb-3 text-red-600">Danger Zone</h3>
                  <Button variant="secondary" className="border-red-600 text-red-600 hover:bg-red-50">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
