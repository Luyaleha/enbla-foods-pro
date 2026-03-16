import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import FoodCard from './components/FoodCard';
import { translations } from './translations';
import { MENU_DATA, CATEGORIES } from './constants/menuData';
import { useCart } from './hooks/useCart';

function App() {
  
  const [lang, setLang] = useState('en');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Check this line!
const { cart, addToCart, removeFromCart, total, clearCart } = useCart();
  const t = translations[lang];

  const filteredMenu = MENU_DATA.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    /* h-screen + overflow-hidden on this parent is MANDATORY to stop the cut-off */
    <div className="flex h-screen w-full bg-gray-50 font-sans text-gray-900 overflow-hidden">
      
      {/* 1. SIDEBAR: Remains fixed to the left */}
      <Sidebar />

      {/* 2. MAIN WRAPPER: Takes the rest of the screen and stays within bounds */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* FIXED HEADER: shrink-0 ensures it doesn't disappear when content grows */}
        <header className="bg-white px-8 py-5 flex justify-end items-center shrink-0 border-b border-gray-100">
          <div className="flex gap-1 bg-gray-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setLang('en')} 
              className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${lang === 'en' ? 'bg-white shadow-md text-orange-600' : 'text-gray-400'}`}
            >EN</button>
            <button 
              onClick={() => setLang('am')} 
              className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${lang === 'am' ? 'bg-white shadow-md text-orange-600' : 'text-gray-400'}`}
            >አማ</button>
          </div>
        </header>

        {/* CONTENT SECTION: Splits Menu and Cart */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* 3. MENU AREA: overflow-y-auto enables the scroll only for this section */}
          <main className="flex-1 overflow-y-auto p-8 lg:p-12">
            <div className="max-w-4xl mb-12">
              <h1 className="text-5xl font-black mb-3 tracking-tight">{t.title}</h1>
              <p className="text-gray-400 text-xl mb-10">{t.subtitle}</p>
              <input 
                type="text" 
                placeholder={t.search} 
                className="w-full pl-6 pr-6 py-5 rounded-[30px] bg-white border-none shadow-sm focus:ring-4 focus:ring-orange-100 outline-none text-lg"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* CATEGORIES (Horizontal scroll enabled with overflow-x-auto) */}
            <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-10 py-4 rounded-[22px] font-bold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-orange-600 text-white shadow-xl' : 'bg-white text-gray-500 hover:bg-orange-50'}`}
                >
                  {t.categories[cat]}
                </button>
              ))}
            </div>

            {/* FOOD GRID: pb-24 adds enough space so the last row isn't cut by the bottom edge */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
              {filteredMenu.map((food) => (
                <FoodCard key={food.id} food={food} onAdd={() => addToCart(food)} />
              ))}
            </div>
          </main>

          {/* 4. CART COLUMN: Fixed width, but internal content scrolls */}
          <aside className="hidden xl:flex w-[400px] bg-white border-l border-gray-100 flex-col shrink-0 overflow-hidden">
  {/* HEADER */}
  <div className="p-10 pb-4 shrink-0">
    <h2 className="text-3xl font-black">{t.cart}</h2>
  </div>
  
  {/* ONE SINGLE SCROLLABLE LIST */}
  <div className="flex-1 overflow-y-auto px-10 space-y-4 scrollbar-hide">
    {cart.length > 0 ? (
      cart.map((item) => (
        <div 
          key={item.id} 
          className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl group transition-all hover:bg-white hover:shadow-md border border-transparent hover:border-orange-100"
        >
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-lg">{item.name}</p>
            <p className="text-sm text-orange-600 font-bold">
              x{item.quantity} — {item.price * item.quantity} <small>ETB</small>
            </p>
          </div>
          
          {/* Professional Delete Button - Appears on Hover */}
          <button 
            onClick={() => removeFromCart(item.id)}
            className="ml-4 p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            title="Remove item"
          >
            ✕
          </button>
        </div>
      ))
    ) : (
      /* Professional Empty State - Only shows when cart is empty */
      <div className="flex flex-col items-center justify-center h-full opacity-30 text-center py-10">
        <div className="text-7xl mb-4">🛒</div>
        <p className="font-bold text-xl text-gray-400 uppercase tracking-widest">{t.empty}</p>
        <p className="text-sm mt-2">Ready for a delicious order?</p>
      </div>
    )}
  </div>

  {/* TOTAL SECTION: Pinned to bottom */}
  <div className="p-10 pt-6 border-t border-gray-100 bg-white shrink-0">
    <div className="flex justify-between items-center mb-8">
      <span className="text-gray-400 font-bold uppercase tracking-widest text-sm">Total</span>
      <span className="text-3xl font-black text-gray-900">{total} <small className="text-sm">ETB</small></span>
    </div>
    <button className="w-full py-6 bg-orange-600 text-white rounded-[28px] font-black text-xl shadow-2xl hover:bg-orange-700 active:scale-95 transition-all">
      {t.checkout}
    </button>
  </div>
</aside>        </div>
      </div>
    </div>
  );
}

export default App;