import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { OrderService } from '@/services/order.service';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Select } from '@/components/common/Select';
import { Input } from '@/components/common/Input';
import { Spinner } from '@/components/common/Spinner';
import { ArrowLeft, Package, MapPin, CreditCard, Truck } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/constants';
import toast from 'react-hot-toast';

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const { data: order, isLoading, refetch } = useQuery({
    queryKey: ['admin-order', id],
    queryFn: async () => {
      if (!id) throw new Error('Order ID required');
      const { data, error } = await OrderService.getOrderById(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
    retry: false,
  });

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Invalid order ID</p>
          <Button onClick={() => navigate('/admin/orders')} className="mt-4">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      if (!id) throw new Error('Order ID required');
      const { error } = await OrderService.updateOrderStatus(id, status);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Order status updated');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const addTrackingMutation = useMutation({
    mutationFn: async (tracking: string) => {
      if (!id) throw new Error('Order ID required');
      const { error } = await OrderService.addTrackingNumber(id, tracking);
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      toast.success('Tracking number added');
      setTrackingNumber('');
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleUpdateStatus = () => {
    if (!newStatus) return;
    updateStatusMutation.mutate(newStatus);
  };

  const handleAddTracking = () => {
    if (!trackingNumber.trim()) return;
    addTrackingMutation.mutate(trackingNumber);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <Button onClick={() => navigate('/admin/orders')} className="mt-4">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order {order.order_number}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin/orders')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Package className="w-5 h-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
              </div>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-sm text-gray-500">
                        {item.variant_name && `Variant: ${item.variant_name} • `}
                        SKU: {item.product_sku || 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">{formatCurrency(order.shipping_cost)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </Card>

            {/* Shipping Address */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
              </div>
              <div className="text-gray-700">
                <p className="font-medium">{order.shipping_full_name}</p>
                <p className="text-sm mt-1">{order.shipping_phone}</p>
                <p className="text-sm mt-2">{order.shipping_address}</p>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Status Management */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Status
                  </label>
                  <Badge variant="primary" className="text-base px-3 py-1">
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </div>

                <div>
                  <Select
                    label="Update Status"
                    options={[
                      { value: '', label: 'Select new status' },
                      ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
                        value,
                        label,
                      })),
                    ]}
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  />
                  <Button
                    onClick={handleUpdateStatus}
                    disabled={!newStatus || updateStatusMutation.isPending}
                    isLoading={updateStatusMutation.isPending}
                    className="w-full mt-2"
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            </Card>

            {/* Payment Info */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-5 h-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <Badge
                    variant={
                      order.payment_status === 'paid'
                        ? 'success'
                        : order.payment_status === 'failed'
                        ? 'error'
                        : 'warning'
                    }
                  >
                    {PAYMENT_STATUS_LABELS[order.payment_status]}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Method</span>
                  <span className="text-gray-900 capitalize">
                    {order.payment_method || 'N/A'}
                  </span>
                </div>
                {order.razorpay_payment_id && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="text-gray-900 text-xs font-mono">
                      {order.razorpay_payment_id.substring(0, 20)}...
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Tracking */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Truck className="w-5 h-5 text-gray-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Tracking</h2>
              </div>
              {order.tracking_number ? (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900">
                    {order.tracking_number}
                  </p>
                  {order.shipped_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      Shipped on {formatDate(order.shipped_at)}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    label="Tracking Number"
                    placeholder="Enter tracking number"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                  <Button
                    onClick={handleAddTracking}
                    disabled={!trackingNumber.trim() || addTrackingMutation.isPending}
                    isLoading={addTrackingMutation.isPending}
                    className="w-full"
                  >
                    Add Tracking
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};