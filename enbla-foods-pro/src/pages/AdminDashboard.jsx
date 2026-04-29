import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // Market Standard: Filter by state
  const audioPlayer = useRef(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sound alert logic for incoming orders
      if (!isInitialLoad.current && newOrders.length > orders.length) {
        audioPlayer.current.play().catch(err => console.log("Audio blocked: User must click page first."));
      }

      setOrders(newOrders);
      isInitialLoad.current = false;
    });

    return () => unsubscribe();
  }, [orders.length]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    } catch (e) { console.error("Update failed:", e); }
  };

  // Logic: Only show orders belonging to the selected tab
  const filteredOrders = orders.filter(order => order.status === activeTab);

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white font-sans">
      <audio ref={audioPlayer} src="/sounds/order-alert.mp3" />

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-orange-500 tracking-tighter uppercase italic">Kitchen Command</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase">Live System Active</p>
          </div>
        </div>

        {/* WORKFLOW TABS */}
        <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700 w-full lg:w-auto overflow-x-auto">
          {['pending', 'preparing', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 lg:flex-none px-8 py-3 rounded-xl text-[11px] font-black uppercase transition-all tracking-tight ${
                activeTab === tab 
                ? 'bg-orange-600 text-white shadow-xl scale-105' 
                : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab} ({orders.filter(o => o.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div 
              key={order.id} 
              className={`group p-6 rounded-3xl border transition-all duration-300 flex flex-col h-full ${
                order.status === 'pending' 
                ? 'bg-orange-600/5 border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.1)] animate-in fade-in' 
                : 'bg-slate-800/50 border-slate-700'
              }`}
            >
              {/* TOP STRIP */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block mb-1">ID: #{order.id.slice(-6)}</span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight leading-none">
                    {order.customer?.name || "Guest User"}
                  </h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                  order.status === 'pending' ? 'bg-orange-600 border-orange-400 text-white' : 'bg-slate-700 border-slate-600 text-slate-400'
                }`}>
                  {order.status}
                </div>
              </div>

              {/* CONTACT INFO */}
              <div className="mb-6">
                <p className="text-orange-500 font-mono text-sm font-bold bg-orange-500/10 inline-block px-3 py-1 rounded-lg">
                  {order.customer?.phone || "No Phone"}
                </p>
              </div>

              {/* ORDER ITEMS LIST */}
              <div className="space-y-3 mb-8 flex-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Order Details</p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center group/item">
                    <span className="text-lg font-bold text-slate-200 group-hover/item:text-white transition-colors">{item.name}</span>
                    <span className="bg-slate-700 h-7 w-7 flex items-center justify-center rounded-lg text-xs font-black text-orange-500">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* ACTION BUTTONS (The Pipeline) */}
              <div className="pt-4 mt-auto border-t border-white/5">
                {order.status === 'pending' && (
                  <button 
                    onClick={() => updateStatus(order.id, 'preparing')} 
                    className="w-full bg-orange-600 hover:bg-orange-700 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                  >
                    🚀 Start Cooking
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button 
                    onClick={() => updateStatus(order.id, 'completed')} 
                    className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                  >
                    ✅ Mark Ready
                  </button>
                )}
                {order.status === 'completed' && (
                  <div className="w-full text-center py-4 text-slate-500 font-black text-xs border-2 border-dashed border-slate-700 rounded-2xl uppercase tracking-[0.2em]">
                    Order Fulfilled
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          /* EMPTY STATE */
          <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-[40px] opacity-30">
            <div className="text-6xl mb-4">🍳</div>
            <p className="font-black uppercase tracking-[0.4em] text-sm">No {activeTab} orders</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;