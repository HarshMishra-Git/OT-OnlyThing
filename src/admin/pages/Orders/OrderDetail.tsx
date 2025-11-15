import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Package, MapPin, CreditCard, User, 
  Calendar, Truck, FileText, Phone, Mail, Download 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { OrderService } from '@/services/order.service';
import { downloadInvoice as downloadInvoiceUtil } from '@/lib/invoice';
import { Button } from '@/components/common/Button';
import { Spinner } from '@/components/common/Spinner';
import { Badge } from '@/components/common/Badge';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface OrderItem {
  id: string;
  product_name: string;
  product_sku?: string;
  variant_name?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  payment_status: string;
  payment_method?: string;
  subtotal: number;
  tax: number;
  shipping_cost: number;
  discount: number;
  total: number;
  shipping_full_name?: string;
  shipping_phone?: string;
  shipping_address?: string;
  tracking_number?: string;
  customer_notes?: string;
  admin_notes?: string;
  created_at: string;
  shipped_at?: string;
  delivered_at?: string;
  profiles?: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      
      // Load order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            full_name,
            email,
            phone
          )
        `)
        .eq('id', id)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);
      setTrackingNumber(orderData.tracking_number || '');
      setAdminNotes(orderData.admin_notes || '');

      // Load order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);

      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (error) {
      toast.error('Failed to load order');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (status: string) => {
    try {
      setUpdating(true);
      const { error } = await OrderService.updateOrderStatus(id as string, status);
      if (error) throw new Error(error);
      toast.success('Order status updated');
      loadOrder();
    } catch (error) {
      toast.error('Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  const updateTrackingNumber = async () => {
    try {
      setUpdating(true);
      const { error } = await OrderService.addTrackingNumber(id as string, trackingNumber);
      if (error) throw new Error(error);
      toast.success('Tracking number updated');
      loadOrder();
    } catch (error) {
      toast.error('Failed to update tracking number');
    } finally {
      setUpdating(false);
    }
  };

  const updateAdminNotes = async () => {
    try {
      setUpdating(true);
      const { error } = await supabase
        .from('orders')
        .update({
          admin_notes: adminNotes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('Notes updated');
    } catch (error) {
      toast.error('Failed to update notes');
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!order) return;
    downloadInvoiceUtil({ ...order, items });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
        <Button onClick={() => navigate('/admin/orders')}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order.order_number}
            </h1>
            <p className="text-gray-600 mt-1">
              Placed on {format(new Date(order.created_at), 'MMMM dd, yyyy HH:mm')}
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={handleDownloadInvoice}>
          <Download className="w-4 h-4 mr-2" />
          Download Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Items
            </h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-start pb-4 border-b last:border-0">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                    {item.variant_name && (
                      <p className="text-sm text-gray-600">{item.variant_name}</p>
                    )}
                    {item.product_sku && (
                      <p className="text-xs text-gray-500">SKU: {item.product_sku}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ₹{item.subtotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">₹{order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">₹{order.shipping_cost.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h2>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">{order.shipping_full_name}</p>
              <p className="text-gray-700 whitespace-pre-line">{order.shipping_address}</p>
              {order.shipping_phone && (
                <p className="text-gray-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {order.shipping_phone}
                </p>
              )}
            </div>
          </div>

          {/* Customer Notes */}
          {order.customer_notes && (
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Customer Notes:
              </h3>
              <p className="text-blue-800 whitespace-pre-line">{order.customer_notes}</p>
            </div>
          )}

          {/* Admin Notes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Internal Notes
            </h2>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              placeholder="Add internal notes about this order..."
              className="mb-3"
            />
            <Button
              onClick={updateAdminNotes}
              disabled={updating}
              size="sm"
            >
              {updating ? <Spinner size="sm" className="mr-2" /> : null}
              Save Notes
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
            <select
              value={order.status}
              onChange={(e) => updateOrderStatus(e.target.value)}
              disabled={updating}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  order.status === 'cancelled' || order.status === 'refunded' 
                    ? 'bg-red-500' 
                    : order.status === 'delivered' 
                    ? 'bg-green-500' 
                    : 'bg-blue-500'
                }`} />
                <span className="text-sm font-medium text-gray-900">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge color={
                  order.payment_status === 'paid' ? 'green' :
                  order.payment_status === 'failed' ? 'red' : 'yellow'
                }>
                  {order.payment_status}
                </Badge>
              </div>
              {order.payment_method && (
                <div>
                  <p className="text-sm text-gray-600">Method</p>
                  <p className="font-medium text-gray-900">{order.payment_method}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-bold text-lg text-gray-900">₹{order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium text-gray-900">
                  {order.profiles?.full_name || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <a 
                  href={`mailto:${order.profiles?.email}`}
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  {order.profiles?.email}
                </a>
              </div>
              {order.profiles?.phone && (
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <a 
                    href={`tel:${order.profiles.phone}`}
                    className="flex items-center gap-2 text-blue-600 hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    {order.profiles.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Tracking */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Tracking
            </h3>
            <div className="space-y-3">
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
              <Button
                onClick={updateTrackingNumber}
                disabled={updating || !trackingNumber}
                className="w-full"
                size="sm"
              >
                {updating ? <Spinner size="sm" className="mr-2" /> : null}
                Update Tracking
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Order Placed</p>
                  <p className="text-xs text-gray-600">
                    {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>

              {order.shipped_at && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Shipped</p>
                    <p className="text-xs text-gray-600">
                      {format(new Date(order.shipped_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              )}

              {order.delivered_at && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Delivered</p>
                    <p className="text-xs text-gray-600">
                      {format(new Date(order.delivered_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}