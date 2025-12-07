
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import About from './components/About';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ChatBot from './components/ChatBot';
import Checkout from './components/Checkout';
import AuthModal from './components/AuthModal';
import ImageGeneratorModal from './components/ImageGeneratorModal';
import AdminDashboard from './components/AdminDashboard';
import OrdersModal from './components/OrdersModal';
import { Product, CartItem, User, Order } from './types';
import { MessageCircle } from 'lucide-react';
import { initDB, getProducts, saveOrder, getOrdersByEmail } from './services/dataService';

type ViewState = 'home' | 'checkout' | 'admin';

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState<ViewState>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  
  // Dynamic Products State
  const [products, setProducts] = useState<Product[]>([]);

  // Initialize DB and load products on mount
  useEffect(() => {
    initDB();
    setProducts(getProducts());
  }, []);

  // Update user orders when opening modal
  useEffect(() => {
    if (isOrdersOpen && user?.email) {
      setUserOrders(getOrdersByEmail(user.email));
    }
  }, [isOrdersOpen, user]);

  const handleUpdateProducts = () => {
    setProducts(getProducts());
  };

  const handleSearch = (query: string) => {
    const allProducts = getProducts();
    if (!query.trim()) {
      setProducts(allProducts);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      );
      setProducts(filtered);
    }
    
    // Always switch to home view to show results
    if (view !== 'home') {
      setView('home');
    }

    // Scroll to products section
    setTimeout(() => {
      const element = document.getElementById('products');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveItem = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const scrollToSection = (id: string) => {
    if (view !== 'home') {
      setView('home');
      // Delay scroll to allow render
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = (customerData?: any) => {
    if (customerData) {
       // Save order to simulated DB
       const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
       saveOrder(cart, customerData, total);
       
       // Update orders list immediately if user is viewing them
       if (user?.email === customerData.email) {
          setUserOrders(getOrdersByEmail(customerData.email));
       }

       // Clear cart but DON'T switch view immediately
       // This allows the Checkout component to show the Success screen
       setCart([]);
    } else {
       // No data passed means user clicked "Back to Home" from success screen
       setView('home');
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // If Admin View is active
  if (view === 'admin') {
    return (
      <AdminDashboard 
        onBackToSite={() => setView('home')} 
        onUpdateProducts={handleUpdateProducts}
      />
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col">
      <Navbar 
        cart={cart} 
        user={user}
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenStudio={() => setIsStudioOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onLogout={() => setUser(null)}
        onScrollToSection={scrollToSection}
        onSearch={handleSearch}
      />
      
      <main className="flex-grow">
        {view === 'home' ? (
          <>
            <Hero onShopNow={() => scrollToSection('products')} />
            {/* Pass dynamic products here */}
            <ProductList products={products} onAddToCart={handleAddToCart} />
            <About />
            <Blog />
            <Testimonials />
            <Contact />
          </>
        ) : (
          <Checkout 
            cart={cart} 
            total={cartTotal}
            user={user}
            onBack={() => setView('home')} 
            onPlaceOrder={(customerData) => handlePlaceOrder(customerData)}
          />
        )}
      </main>

      <Footer onOpenAdmin={() => setView('admin')} />
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(u) => setUser(u)}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={userOrders}
      />

      <ImageGeneratorModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
      />

      <ChatBot />

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/212681736149" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:bg-[#20bd5a] transition-all duration-300 hover:scale-110 flex items-center gap-2"
        aria-label="Contact on WhatsApp"
      >
        <MessageCircle size={24} fill="currentColor" />
        <span className="font-bold hidden md:inline">واتساب</span>
      </a>

    </div>
  );
}

export default App;
