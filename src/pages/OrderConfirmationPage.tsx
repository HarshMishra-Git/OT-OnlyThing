import { Button } from '../components/Button';
import { CheckCircle, Package, Truck, Home, Mail } from 'lucide-react';

export function OrderConfirmationPage() {
  // Get order number from URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const orderNumber = urlParams.get('order');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle size={48} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4">ORDER CONFIRMED!</h1>
          <p className="text-xl text-gray-600 mb-2">Thank you for your purchase</p>
          {orderNumber && (
            <p className="text-sm text-gray-500">
              Order Number: <span className="font-bold text-black">{orderNumber}</span>
            </p>
          )}
        </div>

        {/* Order Timeline */}
        <div className="bg-white border-2 border-black rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-black mb-8">DELIVERY TIMELINE</h2>
          <div className="space-y-6">
            {[
              { icon: CheckCircle, label: 'Order Confirmed', desc: 'Your order has been placed', status: 'complete' },
              { icon: Package, label: 'Processing', desc: 'We\'re preparing your items', status: 'active' },
              { icon: Truck, label: 'Shipped', desc: 'On the way to you', status: 'pending' },
              { icon: Home, label: 'Delivered', desc: 'Estimated in 2-4 business days', status: 'pending' },
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      step.status === 'complete'
                        ? 'bg-green-500 border-green-500 text-white'
                        : step.status === 'active'
                        ? 'bg-black border-black text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{step.label}</p>
                    <p className="text-sm text-gray-600">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8">
          <h3 className="text-xl font-black mb-4">WHAT'S NEXT?</h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-black mt-1" />
              <div>
                <p className="font-bold">Order Confirmation Email</p>
                <p className="text-gray-600">
                  We've sent you an email with your order details and tracking information.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package size={20} className="text-black mt-1" />
              <div>
                <p className="font-bold">Track Your Order</p>
                <p className="text-gray-600">
                  You can track your order status anytime from your account dashboard.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck size={20} className="text-black mt-1" />
              <div>
                <p className="font-bold">Delivery Updates</p>
                <p className="text-gray-600">
                  We'll keep you updated via email and SMS about your delivery status.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => (window.location.href = '/account/orders')} variant="secondary">
            View Order Details
          </Button>
          <Button onClick={() => (window.location.href = '/shop')}>Continue Shopping</Button>
        </div>
      </div>
    </div>
  );
}
