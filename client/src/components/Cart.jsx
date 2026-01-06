import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Tag, Truck, Lock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cart, removeFromCart, updateQuantity, onCheckout }) => {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors duration-200 group"
              >
                <ArrowLeft size={24} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Shopping Cart</h1>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-96">
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <div className="p-6 bg-slate-800 rounded-2xl">
                  <ShoppingBag size={80} className="text-slate-500" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Cart is Empty</h2>
              <p className="text-slate-400 mb-10 text-lg max-w-md mx-auto">
                Looks like you haven't added anything yet. Let's change that!
              </p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <ShoppingBag size={20} />
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Order Items</h2>
                <span className="text-sm text-slate-400 bg-slate-800 px-4 py-2 rounded-full">
                  {itemCount} items
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0 w-full sm:w-28 h-28">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                          {item.quantity}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-white text-lg mb-1">
                            {item.name}
                          </h3>
                          <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-cyan-400">${item.price}</span>
                            <span className="text-slate-500 text-sm">per item</span>
                          </div>
                        </div>

                        {/* Quantity & Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-4 pt-4 border-t border-slate-700">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-1 border border-slate-600">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-slate-600 rounded transition-colors duration-200"
                              title="Decrease quantity"
                            >
                              <Minus size={18} className="text-slate-300" />
                            </button>
                            <span className="px-4 text-center font-bold text-white w-12">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-slate-600 rounded transition-colors duration-200"
                              title="Increase quantity"
                            >
                              <Plus size={18} className="text-slate-300" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-auto px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium"
                            title="Remove item"
                          >
                            <Trash2 size={18} />
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Total Price */}
                      <div className="text-right sm:min-w-fit">
                        <p className="text-slate-400 text-xs mb-2">Subtotal</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-700 rounded-lg">
                      <Truck size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">Free Shipping</p>
                      <p className="text-slate-500 text-xs">On all orders</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-700 rounded-lg">
                      <Lock size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">Secure Checkout</p>
                      <p className="text-slate-500 text-xs">SSL Encrypted</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-700 rounded-lg">
                      <Star size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">Money Back</p>
                      <p className="text-slate-500 text-xs">30 day guarantee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 sticky top-24 shadow-xl">
                <h3 className="text-2xl font-bold text-white mb-6">Order Summary</h3>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6 pb-6 border-b border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="font-semibold text-white">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Shipping</span>
                    <span className="font-bold text-cyan-400 flex items-center gap-1">
                      FREE <Truck size={16} />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Estimated Tax</span>
                    <span className="font-semibold text-white">Calculated at checkout</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-4 mb-6">
                  <p className="text-slate-400 text-sm mb-2">Total Amount</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    ${total.toFixed(2)}
                  </p>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={onCheckout}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 mb-3 flex items-center justify-center gap-2"
                >
                  <Lock size={20} />
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => navigate('/')}
                  className="w-full border-2 border-slate-600 hover:border-blue-500 text-slate-300 hover:text-blue-400 font-semibold py-3 rounded-lg transition-all duration-200"
                >
                  Continue Shopping
                </button>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-slate-700 text-center">
                  <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-800 px-3 py-2 rounded-full mb-2">
                    <Lock size={14} className="text-cyan-400" />
                    <span>Stripe Powered</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
