import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, ShoppingCart, AlertCircle, HelpCircle, Home } from 'lucide-react';

const Failure = () => {
  const navigate = useNavigate();

  const commonIssues = [
    {
      icon: '💳',
      title: 'Insufficient Funds',
      description: 'Your card may not have enough balance'
    },
    {
      icon: '🔒',
      title: 'Card Declined',
      description: 'Your bank declined the transaction'
    },
    {
      icon: '📅',
      title: 'Expired Card',
      description: 'Check your card expiration date'
    },
    {
      icon: '⚠️',
      title: 'Incorrect Details',
      description: 'Card number, CVV, or ZIP code may be wrong'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Error */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-center text-white">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4 animate-bounce">
                <XCircle className="text-red-500" size={64} />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-2">Payment Failed</h2>
            <p className="text-red-100 text-lg">
              Unfortunately, we couldn't process your payment
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Message */}
            <div className="mb-8 text-center">
              <p className="text-gray-600 text-lg">
                Don't worry! Your order has not been placed and you have not been charged.
              </p>
            </div>

            {/* Common Issues */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <HelpCircle className="text-orange-600" />
                Common Reasons for Payment Failure
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commonIssues.map((issue, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-orange-300 transition">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{issue.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{issue.title}</h4>
                        <p className="text-sm text-gray-600">{issue.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What to Do Next */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-gray-900 mb-2">
                    💡 What to Do Next
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Double-check your card details (number, expiry, CVV)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Ensure you have sufficient funds in your account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Try using a different payment method or card</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Contact your bank if the issue persists</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cart Saved Notice */}
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3">
                <ShoppingCart className="text-green-600 flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    ✅ Your Cart is Saved
                  </p>
                  <p className="text-sm text-gray-600">
                    All items in your cart are still there. You can try checking out again whenever you're ready.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button
                onClick={() => navigate('/checkout')}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-4 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ShoppingCart size={20} />
                Try Again
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-4 rounded-lg hover:bg-gray-300 transition-all font-bold text-lg shadow-md hover:shadow-lg"
              >
                <Home size={20} />
                Back to Shop
              </button>
            </div>

            {/* Support Contact */}
            <div className="text-center pt-6 border-t">
              <p className="text-sm text-gray-600 mb-2">
                Still having trouble? We're here to help!
              </p>
              <a 
                href="mailto:support@techstore.com"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              >
                📧 Contact Support
              </a>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <HelpCircle className="text-blue-600" size={20} />
            Payment Security
          </h4>
          <p className="text-sm text-gray-600 mb-2">
            All payments are processed securely through Stripe. We never store your card details on our servers.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-4">
            <span className="flex items-center gap-1">
              <span className="text-green-600">🔒</span> SSL Encrypted
            </span>
            <span className="flex items-center gap-1">
              <span className="text-blue-600">💳</span> PCI Compliant
            </span>
            <span className="flex items-center gap-1">
              <span className="text-purple-600">🛡️</span> Secure Checkout
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Failure;