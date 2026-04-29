import { seedDatabase } from '../services/seed';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { db } from '../services/firebase'; 
import Sidebar from '../components/Sidebar';
import FoodCard from '../components/FoodCard';
import CheckoutModal from '../components/CheckoutModal'; // CHANGE 1: Import Modal
import { translations } from '../translations';
import { CATEGORIES } from '../constants/menuData'; 
import { useCart } from '../hooks/useCart';

function CustomerMenu() {
  const [lang, setLang] = useState('en');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false); // CHANGE 2: Modal visibility state
  
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { cart, addToCart, removeFromCart, total, clearCart } = useCart();
  const t = translations[lang];

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMenuItems(items);
      setLoading(false);
    }, (error) => {
      console.error("Firebase Error:", error);
      setLoading(false);
    });
    return () => unsubscribe(); 
  }, []);

  // CHANGE 3: Logic now accepts customerData from the Modal
  const handleCheckout = async (customerData) => {
    if (isSubmitting || cart.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const orderData = {
        items: cart,
        totalAmount: total,
        customer: customerData, // Attached user info (Name/Phone)
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      
      if (docRef.id) {
        setShowCheckout(false); // Close Modal
        clearCart();
        setIsCartOpen(false);
        alert(`Order Successful, ${customerData.name}! We will call you at ${customerData.phone}.`);
      }
    } catch (error) {
      console.error("Order Failed:", error);
      alert("Failed to place order. Check your internet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredMenu = menuItems.filter(item => {
    const itemCat = item.category ? item.category.toLowerCase() : '';
    const selectedCat = activeCategory.toLowerCase();
    const matchesCategory = selectedCat === 'all' || itemCat === selectedCat;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col xl:flex-row h-screen w-full bg-gray-50 font-sans text-gray-900 overflow-hidden">
      
      {/* Checkout Modal Component */}
      <CheckoutModal 
        isOpen={showCheckout} 
        onClose={() => setShowCheckout(false)}
        onConfirm={handleCheckout}
        total={total}
        isSubmitting={isSubmitting}
      />

      <div className="hidden xl:block">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        <header className="bg-white px-4 xl:px-6 py-2 flex justify-between items-center shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-orange-600 uppercase tracking-tighter">Enbla</h1>
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg scale-75 xl:scale-90">
              <button onClick={() => setLang('en')} className={`px-2 py-1 rounded-md font-bold text-[10px] ${lang === 'en' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}>EN</button>
              <button onClick={() => setLang('am')} className={`px-2 py-1 rounded-md font-bold text-[10px] ${lang === 'am' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}>አማ</button>
            </div>
          </div>

          <div className="relative flex-1 max-w-[180px] xl:max-w-96 ml-2">
            <input 
              type="text" 
              placeholder={t.search} 
              className="w-full pl-3 pr-3 py-1.5 rounded-xl bg-gray-100 border-none text-xs xl:text-sm outline-none focus:ring-2 focus:ring-orange-200"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button onClick={() => setIsCartOpen(!isCartOpen)} className="xl:hidden ml-2 p-2 bg-orange-100 text-orange-600 rounded-lg relative">
            🛒 {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 xl:p-6 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <div className="mb-3 xl:mb-4">
              <h2 className="text-xl xl:text-3xl font-black tracking-tight leading-tight text-gray-900">{t.title}</h2>
              <p className="text-gray-400 text-[9px] xl:text-[10px] mt-0.5 uppercase tracking-widest font-bold">{t.subtitle}</p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide border-b border-gray-50 snap-x">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-lg font-bold whitespace-nowrap text-[10px] xl:text-xs uppercase transition-all snap-start ${activeCategory === cat ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-50 text-gray-400'}`}
                >
                  {t.categories[cat]}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-orange-600 mb-4"></div>
                <p className="text-xs font-bold uppercase tracking-widest">Updating Menu...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 xl:gap-4 pb-24 items-start">
                {filteredMenu.map((food) => (
                  <div key={food.id} className="h-full flex flex-col">
                    <FoodCard food={food} onAdd={() => addToCart(food)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <aside className={`fixed xl:relative top-0 right-0 h-full z-50 transition-transform duration-300 transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} xl:translate-x-0 flex flex-col w-[85%] xl:w-[380px] bg-white border-l border-gray-100 shadow-2xl xl:shadow-none`}>
        <div className="p-5 pb-3 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsCartOpen(false)} className="xl:hidden text-gray-400 font-bold px-2">✕</button>
            <h2 className="text-lg font-black uppercase tracking-widest text-gray-800">{t.cart}</h2>
          </div>
          {cart.length > 0 && <button onClick={clearCart} className="text-[10px] font-bold text-red-500 px-2 py-1 rounded-full">Clear All</button>}
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 space-y-2 py-2 scrollbar-hide bg-gray-50/30">
          {cart.length > 0 ? cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-xs truncate">{item.name}</p>
                <p className="text-[10px] text-orange-600 font-black uppercase">x{item.quantity} — {item.price * item.quantity} ETB</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="ml-3 p-1.5 text-gray-300 hover:text-red-500">✕</button>
            </div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
              <div className="text-5xl mb-4">🛒</div>
              <p className="font-black text-[10px] uppercase tracking-[0.3em]">{t.empty}</p>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-white shrink-0">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total</span>
            <span className="text-xl font-black text-gray-900">{total} <small className="text-[10px] font-normal">ETB</small></span>
          </div>
          {/* CHANGE: Button now opens the Modal instead of calling handleCheckout directly */}
          <button 
            disabled={isSubmitting || cart.length === 0}
            onClick={() => setShowCheckout(true)}
            className={`w-full py-4 bg-orange-600 text-white rounded-xl font-black text-base shadow-lg hover:bg-orange-700 active:scale-95 transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'PROCESSING...' : t.checkout}
          </button>
        </div>
      </aside>

      {isCartOpen && <div onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black/40 z-40 xl:hidden backdrop-blur-sm" />}
    </div>
  );
}

export default CustomerMenu;