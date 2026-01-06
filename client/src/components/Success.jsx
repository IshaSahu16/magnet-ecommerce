import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package, Mail, CreditCard, Calendar, Home } from 'lucide-react';
import axios from 'axios';

const Success = ({ clearCart }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  const fetchOrderDetails = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/${sessionId}`);
      setOrderDetails(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      fetchOrderDetails();
      // Clear cart after successful payment
      if (clearCart) {
        clearCart();
      }
    } else {
      setLoading(false);
    }
  }, [sessionId, fetchOrderDetails, clearCart]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-green-600"></div>
        <p className="mt-4 text-gray-600 font-semibold">Loading your order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center text-white">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4 animate-bounce">
                <CheckCircle className="text-green-500" size={64} />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-green-100 text-lg">
              Thank you for your purchase 🎉
            </p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            <div className="mb-8 text-center">
              <p className="text-gray-600 text-lg">
                Your order has been confirmed and will be processed shortly.
              </p>
            </div>

            {orderDetails && (
              <>
                {/* Order Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="text-blue-600" size={20} />
                      <span className="font-semibold text-gray-700">Order ID</span>
                    </div>
                    <p className="text-sm font-mono text-gray-900">{orderDetails._id}</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="text-green-600" size={20} />
                      <span className="font-semibold text-gray-700">Total Amount</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      ${orderDetails.totalAmount.toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="text-purple-600" size={20} />
                      <span className="font-semibold text-gray-700">Email</span>
                    </div>
                    <p className="text-sm text-gray-900 truncate">{orderDetails.customerEmail}</p>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="text-yellow-600" size={20} />
                      <span className="font-semibold text-gray-700">Order Date</span>
                    </div>
                    <p className="text-sm text-gray-900">
                      {new Date(orderDetails.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Package className="text-blue-600" />
                    Items Purchased
                  </h3>
                  <div className="space-y-3">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-gray-900 text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Status */}
                <div className={`rounded-xl p-6 mb-8 border-2 ${
                  orderDetails.paymentStatus === 'succeeded' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Payment Status</p>
                      <p className={`text-2xl font-bold capitalize ${
                        orderDetails.paymentStatus === 'succeeded' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {orderDetails.paymentStatus}
                      </p>
                    </div>
                    {orderDetails.transactionId && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Transaction ID</p>
                        <p className="text-xs font-mono text-gray-700">{orderDetails.transactionId}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Email Confirmation Notice */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <Mail className="text-blue-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    📧 Confirmation Email Sent
                  </p>
                  <p className="text-sm text-gray-600">
                    A confirmation email with your order details and receipt has been sent to your email address. 
                    Please check your inbox and spam folder.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Home size={20} />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Need help? Contact us at <a href="mailto:support@techstore.com" className="text-blue-600 hover:underline font-semibold">support@techstore.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;