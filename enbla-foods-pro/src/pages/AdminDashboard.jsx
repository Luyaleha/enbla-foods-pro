import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      <h1 className="text-2xl font-black mb-6 text-orange-500">ENBLA KITCHEN DASHBOARD</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-slate-400 font-mono">ID: {order.id}</p>
                <div className="text-lg font-bold mt-1">
                  {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}
                </div>
                <p className="text-orange-400 font-black mt-1">{order.totalAmount} ETB</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase font-black text-center px-2 py-1 bg-slate-700 rounded text-orange-200">{order.status}</span>
                {order.status === 'pending' && (
                  <button onClick={() => updateStatus(order.id, 'preparing')} className="bg-orange-600 text-[10px] font-bold py-2 px-4 rounded">START COOKING</button>
                )}
                {order.status === 'preparing' && (
                  <button onClick={() => updateStatus(order.id, 'completed')} className="bg-green-600 text-[10px] font-bold py-2 px-4 rounded">DONE</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;