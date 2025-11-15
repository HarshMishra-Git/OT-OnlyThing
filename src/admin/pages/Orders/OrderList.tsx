import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Package, DollarSign, TrendingUp, 
  Clock, CheckCircle, XCircle, Truck 
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { OrderService } from '@/services/order.service';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';
import { Badge } from '@/components/common/Badge';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

const statusConfig = {
  pending: { color: 'yellow', icon: Clock, label: 'Pending' },
  confirmed: { color: 'blue', icon: CheckCircle, label: 'Confirmed' },
  processing: { color: 'purple', icon: Package, label: 'Processing' },
  shipped: { color: 'indigo', icon: Truck, label: 'Shipped' },
  delivered: { color: 'green', icon: CheckCircle, label: 'Delivered' },
  cancelled: { color: 'red', icon: XCircle, label: 'Cancelled' },
  refunded: { color: 'gray', icon: XCircle, label: 'Refunded' },
};

export function OrderList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');

  const { data: ordersData, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await OrderService.getAllOrders();
      if (error) throw new Error(error);
      return data as any as Order[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await OrderService.updateOrderStatus(orderId, status);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Order status updated');
      refetch();
    },
    onError: () => {
      toast.error('Failed to update order');
    },
  });

  const filteredOrders = useMemo(() => {
    const orders = ordersData || [];
    const matchesSearch = 
      (o: Order) =>
        o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = (o: Order) => filterStatus === 'all' || o.status === filterStatus;
    const matchesPayment = (o: Order) => filterPayment === 'all' || o.payment_status === filterPayment;
    
    return orders.filter((o) => matchesSearch(o) && matchesStatus(o) && matchesPayment(o));
  }, [ordersData, searchTerm, filterStatus, filterPayment]);

  const stats = useMemo(() => {
    const orders = ordersData || [];
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      revenue: orders
        .filter(o => o.payment_status === 'paid')
        .reduce((sum, o) => sum + parseFloat(o.total.toString()), 0),
    };
  }, [ordersData]);

  if (isLoading) {
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">Manage customer orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Package className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-purple-600">{stats.processing}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{stats.revenue.toFixed(2)}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filterPayment}
            onChange={(e) => setFilterPayment(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.order_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.profiles?.full_name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.profiles?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatusMutation.mutate({ orderId: order.id, status: e.target.value })}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-2 cursor-pointer
                        ${order.status === 'pending' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : ''}
                        ${order.status === 'confirmed' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}
                        ${order.status === 'processing' ? 'bg-purple-50 border-purple-200 text-purple-700' : ''}
                        ${order.status === 'shipped' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : ''}
                        ${order.status === 'delivered' ? 'bg-green-50 border-green-200 text-green-700' : ''}
                        ${order.status === 'cancelled' ? 'bg-red-50 border-red-200 text-red-700' : ''}
                      `}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color={
                      order.payment_status === 'paid' ? 'green' :
                      order.payment_status === 'failed' ? 'red' : 'yellow'
                    }>
                      {order.payment_status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{parseFloat(order.total.toString()).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(order.created_at), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' || filterPayment !== 'all'
                ? 'Try adjusting your filters'
                : 'No orders yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}