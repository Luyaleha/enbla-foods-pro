import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const audioPlayer = useRef(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (!isInitialLoad.current && newOrders.length > orders.length) {
        audioPlayer.current.play().catch(err => console.log("Interaction required for audio:", err));
      }

      setOrders(newOrders);
      isInitialLoad.current = false;
    });

    return () => unsubscribe();
  }, [orders.length]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white font-sans">
      <audio ref={audioPlayer} src="/sounds/order-alert.mp3" />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black text-orange-500 tracking-tighter">ENBLA KITCHEN COMMAND</h1>
        <div className="bg-orange-600/20 text-orange-500 px-4 py-1 rounded-full text-xs font-bold border border-orange-500/30">
          {orders.filter(o => o.status !== 'completed').length} ACTIVE ORDERS
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map(order => (
          <div key={order.id} className={`p-5 rounded-2xl border transition-all ${order.status === 'pending' ? 'bg-orange-600/10 border-orange-500 animate-pulse' : 'bg-slate-800 border-slate-700'}`}>
            <div className="flex justify-between mb-2">
              <span className="text-[10px] font-mono text-slate-500">#{order.id.slice(-6)}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase ${order.status === 'pending' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                {order.status}
              </span>
            </div>

            {/* NEW: CUSTOMER INFO SECTION */}
            <div className="mb-4 pb-4 border-b border-white/5">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">
                {order.customer?.name || "Guest User"}
              </h3>
              <p className="text-orange-500 font-mono text-sm font-bold">
                {order.customer?.phone || "No Phone Provided"}
              </p>
            </div>

            <div className="space-y-2 mb-6">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-200">{item.name}</span>
                  <span className="bg-slate-700 h-6 w-6 flex items-center justify-center rounded text-xs font-black text-white">x{item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              {order.status === 'pending' && (
                <button onClick={() => updateStatus(order.id, 'preparing')} className="flex-1 bg-orange-600 hover:bg-orange-700 py-3 rounded-xl font-black text-xs transition-all uppercase">Start Cooking</button>
              )}
              {order.status === 'preparing' && (
                <button onClick={() => updateStatus(order.id, 'completed')} className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-xl font-black text-xs transition-all uppercase">Ready for Pickup</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;