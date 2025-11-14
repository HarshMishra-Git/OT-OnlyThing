import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Package, ShoppingCart, MessageSquare, FileText, Users, TrendingUp } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

export const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Products', value: '0', icon: Package, color: 'bg-gray-900' },
    { label: 'Total Orders', value: '0', icon: ShoppingCart, color: 'bg-accent-600' },
    { label: 'Pending Queries', value: '0', icon: MessageSquare, color: 'bg-yellow-500' },
    { label: 'Blog Posts', value: '0', icon: FileText, color: 'bg-gray-700' },
  ];

  const quickActions = [
    { label: 'Add Product', to: '/admin/products/new', icon: Package, color: 'primary' },
    { label: 'View Orders', to: '/admin/orders', icon: ShoppingCart, color: 'secondary' },
    { label: 'Manage Queries', to: '/admin/queries', icon: MessageSquare, color: 'primary' },
    { label: 'Create Post', to: '/admin/blog/new', icon: FileText, color: 'secondary' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back, {user?.full_name || 'Admin'}</p>
            </div>
            <Link to="/">
              <Button variant="outline">View Store</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.label} to={action.to}>
                <Card hover className="p-6 text-center">
                  <action.icon className="w-8 h-8 mx-auto mb-3 text-gray-900" />
                  <p className="font-medium text-gray-900">{action.label}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/products">
            <Card hover className="p-6">
              <Package className="w-10 h-10 text-gray-900 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Products</h3>
              <p className="text-sm text-gray-600">Manage your product catalog</p>
            </Card>
          </Link>

          <Link to="/admin/orders">
            <Card hover className="p-6">
              <ShoppingCart className="w-10 h-10 text-accent-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Orders</h3>
              <p className="text-sm text-gray-600">View and manage orders</p>
            </Card>
          </Link>

          <Link to="/admin/queries">
            <Card hover className="p-6">
              <MessageSquare className="w-10 h-10 text-yellow-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Queries</h3>
              <p className="text-sm text-gray-600">Respond to customer inquiries</p>
            </Card>
          </Link>

          <Link to="/admin/blog">
            <Card hover className="p-6">
              <FileText className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Blog</h3>
              <p className="text-sm text-gray-600">Create and manage blog posts</p>
            </Card>
          </Link>

          <Link to="/admin/categories">
            <Card hover className="p-6">
              <TrendingUp className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Categories</h3>
              <p className="text-sm text-gray-600">Organize product categories</p>
            </Card>
          </Link>

          <Link to="/admin/reviews">
            <Card hover className="p-6">
              <Users className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reviews</h3>
              <p className="text-sm text-gray-600">Moderate product reviews</p>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
};