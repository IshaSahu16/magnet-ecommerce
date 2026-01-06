import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingCart, Package, TrendingUp, Award, Headphones, Menu, X } from 'lucide-react';
import axios from 'axios';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Success from './components/Success';
import Failure from './components/Failure';

//navbar component
const Navbar = ({ cartCount }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-blue-500/10' : 'bg-slate-900/90 backdrop-blur-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg group-hover:scale-110 transition-transform">
              <Package size={24} className="text-white" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              TechHub
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-slate-300 hover:text-cyan-400 font-semibold transition-colors">
              Shop
            </Link>
            <Link to="/" className="text-slate-300 hover:text-cyan-400 font-semibold transition-colors">
              Deals
            </Link>
            <Link to="/" className="text-slate-300 hover:text-cyan-400 font-semibold transition-colors">
              Support
            </Link>
            
            <Link 
              to="/cart"
              className="relative group"
            >
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-5 py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                <ShoppingCart size={20} />
                <span className="font-bold">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-slate-300 hover:text-cyan-400 font-semibold py-2">
                Shop
              </Link>
              <Link to="/" className="text-slate-300 hover:text-cyan-400 font-semibold py-2">
                Deals
              </Link>
              <Link to="/" className="text-slate-300 hover:text-cyan-400 font-semibold py-2">
                Support
              </Link>
              <Link to="/cart" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-3 rounded-lg font-bold text-center">
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

//home component
const Home = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
      setProducts(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCart({ ...addedToCart, [product.id]: true });
    
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-950">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="relative animate-spin rounded-full h-24 w-24 border-4 border-slate-700 border-t-blue-500"></div>
        </div>
        <p className="mt-8 text-xl text-slate-300 font-semibold">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950">
        <div className="text-center bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-12 max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-xl mb-6 font-semibold">{error}</p>
          <button 
            onClick={fetchProducts}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-lg transition-all font-bold text-lg shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Sec */}
        <div className="text-center mb-16 space-y-8 pt-8">
          <div className="inline-block">
            <span className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-cyan-400 px-6 py-2 rounded-full text-sm font-bold">
              🚀 Latest Tech 2026
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Next-Gen Technology
            </span>
            <br />
            <span className="text-white">
              For Everyone
            </span>
          </h2>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            Explore cutting-edge products with premium quality and modern design. 
            Upgrade your tech game today.
          </p>
          
          {/* dummpy appleaing content */}
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <div className="group bg-slate-800 border border-slate-700 hover:border-blue-500 px-6 py-3 rounded-lg transition-all cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/20 rounded">
                  <Package size={16} className="text-blue-400" />
                </div>
                <span className="text-slate-300 font-semibold">Free Shipping</span>
              </div>
            </div>
            
            <div className="group bg-slate-800 border border-slate-700 hover:border-cyan-500 px-6 py-3 rounded-lg transition-all cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-cyan-500/20 rounded">
                  <Award size={16} className="text-cyan-400" />
                </div>
                <span className="text-slate-300 font-semibold">Warranty</span>
              </div>
            </div>
            
            <div className="group bg-slate-800 border border-slate-700 hover:border-green-500 px-6 py-3 rounded-lg transition-all cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-500/20 rounded">
                  <Headphones size={16} className="text-green-400" />
                </div>
                <span className="text-slate-300 font-semibold">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className="group relative bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards',
                opacity: 0
              }}
            >
              {/* Product Image */}
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Price */}
                <div className="absolute top-2 right-2 z-20">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-xl">
                    ${product.price}
                  </div>
                </div>

                {/* Trending */}
                <div className="absolute top-2 left-2 bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg z-20 border border-slate-700">
                  <div className="flex items-center gap-1">
                    <TrendingUp size={12} className="text-green-400" />
                    <span className="text-xs font-bold text-green-400">Popular</span>
                  </div>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                
                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={addedToCart[product.id]}
                  className={`w-full relative overflow-hidden rounded-lg transition-all duration-300 ${
                    addedToCart[product.id]
                      ? 'scale-95'
                      : 'hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  <div className={`absolute inset-0 transition-all duration-300 ${
                    addedToCart[product.id]
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600'
                  }`}></div>
                  
                  <div className="relative flex items-center justify-center gap-2 py-2.5 px-4">
                    {addedToCart[product.id] ? (
                      <>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="font-bold text-white text-sm">Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} className="text-white" />
                        <span className="font-bold text-white text-sm">Add to Cart</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* visual component */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center hover:border-blue-500 transition-all">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Free Delivery</h3>
            <p className="text-slate-400">Fast shipping on all orders worldwide</p>
          </div>
          
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center hover:border-cyan-500 transition-all">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Award size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Premium Quality</h3>
            <p className="text-slate-400">Top-rated products with warranty</p>
          </div>
          
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center hover:border-green-500 transition-all">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Headphones size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">24/7 Support</h3>
            <p className="text-slate-400">Always here to help you</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        return JSON.parse(savedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    //routes are defined here to navigate between different pages
    <Router>
      <div className="min-h-screen bg-slate-950">
        <Navbar 
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        />
        
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route 
            path="/cart"
            element={
              <Cart 
                cart={cart}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                onCheckout={() => window.location.href = '/checkout'}
              />
            }
          />
          <Route 
            path="/checkout" 
            element={
              <Checkout 
                cart={cart} 
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            } 
          />
          <Route path="/success" element={<Success clearCart={clearCart} />} />
          <Route path="/failed" element={<Failure />} />
        </Routes>

        {/* Footer component */}
        <footer className="relative bg-slate-900 border-t border-slate-800 text-white py-12 mt-20">
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <Package size={24} className="text-white" />
                </div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  TechHub
                </h2>
              </div>
              <p className="text-slate-400 max-w-md mx-auto">
                Your trusted destination for premium technology products
              </p>
            </div>
            
            <div className="flex justify-center gap-8 mb-8">
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors font-semibold">Shop</a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors font-semibold">About</a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors font-semibold">Contact</a>
              <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors font-semibold">Support</a>
            </div>
            
            <div className="border-t border-slate-800 pt-6">
              <p className="text-slate-500 text-sm">© 2026 TechHub. All rights reserved.</p>
              <p className="text-xs text-slate-600 mt-2 flex items-center justify-center gap-2">
                <Package size={14} />
                Secure payments powered by Stripe
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

<style jsx>{`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`}</style>