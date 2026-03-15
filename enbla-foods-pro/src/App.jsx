import React, { useState } from 'react'; // 1. Added useState
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import FoodCard from './components/FoodCard';

// This is your data source
const MENU_DATA = [
  { id: 1, name: "Special Kitfo", price: 1250, category: "meat", rating: 4.9, img: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400" },
  { id: 2, name: "Doro Wet", price: 850, category: "stews", rating: 4.8, img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400" },
  { id: 3, name: "Beyaynetu", price: 550, category: "veg", rating: 5.0, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400" },
  { id: 4, name: "Beef Tibs", price: 950, category: "meat", rating: 4.7, img: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400" },
];

const CATEGORIES = [
  { id: 'all', name: 'All Dishes', icon: '🍽️' },
  { id: 'stews', name: 'Hot Stews', icon: '🍲' },
  { id: 'meat', name: 'Meat & Tibs', icon: '🥩' },
  { id: 'veg', name: 'Vegetarian', icon: '🥗' },
];

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState(''); // 1. New State for search

  // 2. Advanced Logic: Filter by Category AND Search Text
  const filteredMenu = MENU_DATA.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
  <div className="flex min-h-screen bg-gray-50 font-sans">
    {/* COLUMN 1: Sidebar */}
    <Sidebar />

    {/* COLUMN 2: Main Menu */}
    <div className="flex-1 h-screen overflow-y-auto">
      <Navbar />
      <main className="p-6 lg:p-10">
        {/* Search Bar */}
        <div className="mb-10">
          <input 
            type="text" 
            placeholder="Search for Kitfo, Doro..." 
            className="w-full max-w-md px-6 py-4 rounded-2xl bg-white border-none shadow-sm focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-4 mb-10 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button key={cat.id} className="px-6 py-3 bg-white rounded-xl font-bold shadow-sm">
              {cat.name}
            </button>
          ))}
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMenu.map(food => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </main>
    </div>

    {/* COLUMN 3: Right Side Cart (The Netlify look) */}
    <aside className="hidden xl:flex w-96 bg-white border-l border-gray-100 flex-col p-8 sticky top-0 h-screen">
      <h2 className="text-2xl font-black mb-6">Your Order</h2>
      
      {/* Scrollable Items List */}
      <div className="flex-1 space-y-6 overflow-y-auto">
        <p className="text-gray-400 italic">Your cart is currently empty...</p>
      </div>

      {/* Summary Footer */}
      <div className="pt-6 border-t border-gray-100">
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-bold">0.00 ETB</span>
        </div>
        <div className="flex justify-between mb-6">
          <span className="text-gray-500">Delivery</span>
          <span className="font-bold text-green-600">Free</span>
        </div>
        <button className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all">
          Checkout Now
        </button>
      </div>
    </aside>
  </div>
);
}
export default App;