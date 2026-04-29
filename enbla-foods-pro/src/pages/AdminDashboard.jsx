import React, { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore'; 
import { db } from '../services/firebase'; 

function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [view, setView] = useState('orders'); // 'orders' or 'inventory'
  
  // Modal & Edit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); 
  
  // Form State
  const [formData, setFormData] = useState({ name: '', price: '', category: '', image: '' });
  
  const audioPlayer = useRef(null);
  const isInitialLoad = useRef(true);

  // --- REAL-TIME DATA SYNC ---
  useEffect(() => {
    // Sync Orders
    const qO = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsubO = onSnapshot(qO, (snapshot) => {
      const newOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Alert sound for new orders
      if (!isInitialLoad.current && newOrders.length > orders.length) {
        audioPlayer.current.play().catch(() => console.log("Audio waiting for user interaction"));
      }
      setOrders(newOrders);
      isInitialLoad.current = false;
    });

    // Sync Products (Inventory)
    const qP = query(collection(db, "products"), orderBy("name", "asc"));
    const unsubP = onSnapshot(qP, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => { unsubO(); unsubP(); };
  }, [orders.length]);

  // --- SAVE LOGIC (ADD / EDIT) ---
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        category: formData.category.trim(),
        image: formData.image,
        updatedAt: new Date()
      };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), payload);
      } else {
        await addDoc(collection(db, "products"), { ...payload, createdAt: new Date() });
      }
      closeModal();
    } catch (error) {
      console.error("Operation failed:", error);
      alert("Error saving data. Check console.");
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormData({ 
      name: product.name, 
      price: product.price, 
      category: product.category || '', 
      image: product.image || '' 
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', price: '', category: '', image: '' });
  };

  const updateOrderStatus = async (orderId, currentStatus) => {
    const nextStatus = currentStatus === 'pending' ? 'preparing' : 'completed';
    await updateDoc(doc(db, "orders", orderId), { status: nextStatus });
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this dish?")) {
      await deleteDoc(doc(db, "products", id));
    }
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white font-sans">
      <audio ref={audioPlayer} src="/sounds/order-alert.mp3" />

      {/* TOP NAVIGATION BAR */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-orange-500 tracking-tighter uppercase italic">Enbla Command</h1>
          <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700 mt-4 w-fit">
            <button 
              onClick={() => setView('orders')} 
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${view === 'orders' ? 'bg-orange-600' : 'text-slate-500 hover:text-white'}`}
            >
              Live Orders
            </button>
            <button 
              onClick={() => setView('inventory')} 
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${view === 'inventory' ? 'bg-orange-600' : 'text-slate-500 hover:text-white'}`}
            >
              Manage Menu
            </button>
          </div>
        </div>

        {view === 'orders' && (
          <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
            {['pending', 'preparing', 'completed'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`px-6 py-3 rounded-xl text-[11px] font-black uppercase transition-all ${activeTab === tab ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-400'}`}
              >
                {tab} ({orders.filter(o => o.status === tab).length})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MAIN VIEW AREA */}
      {view === 'orders' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {orders.filter(o => o.status === activeTab).length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-[3rem]">
              <p className="text-slate-600 font-black uppercase text-xs tracking-widest">No {activeTab} orders at the moment</p>
            </div>
          ) : (
            orders.filter(o => o.status === activeTab).map(order => (
              <div key={order.id} className="p-6 rounded-[2.5rem] border border-slate-700 bg-slate-800/40 flex flex-col h-full hover:border-orange-500/50 transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black uppercase text-white leading-none mb-1">{order.customer?.name || "Guest"}</h3>
                    <p className="text-[10px] text-slate-500 font-mono italic">ID: {order.id.slice(-6)}</p>
                  </div>
                  <span className="bg-slate-700 px-3 py-1 rounded-full text-[9px] font-black uppercase text-orange-500">{order.tableNumber ? `Table ${order.tableNumber}` : 'Takeout'}</span>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex justify-between items-center font-bold text-sm bg-slate-900/50 p-3 rounded-xl">
                      <span className="text-slate-300">{item.name}</span>
                      <span className="text-orange-500 bg-orange-500/10 px-2 py-1 rounded-lg">x{item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-6 px-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Amount</span>
                  <span className="text-xl font-black text-white">{order.totalPrice} ETB</span>
                </div>

                <button 
                  onClick={() => updateOrderStatus(order.id, order.status)} 
                  className={`w-full py-5 rounded-3xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 shadow-xl ${
                    order.status === 'pending' ? 'bg-orange-600 hover:bg-orange-500' : 'bg-green-600 hover:bg-green-500'
                  }`}
                >
                  {order.status === 'pending' ? '🚀 Send to Kitchen' : '✅ Mark as Ready'}
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        /* INVENTORY VIEW */
        <div className="bg-slate-800/20 rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-10 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
            <h2 className="font-black uppercase text-2xl tracking-tighter">Kitchen Inventory</h2>
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="bg-orange-600 hover:bg-orange-500 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-orange-600/20 transition-all active:scale-95"
            >
              + Add New Dish
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[10px] uppercase text-slate-500 bg-slate-800/40">
                <tr>
                  <th className="px-10 py-6 font-black">Dish Information</th>
                  <th className="px-10 py-6 font-black">Category</th>
                  <th className="px-10 py-6 font-black">Price</th>
                  <th className="px-10 py-6 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-6 flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                        <img src={product.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="font-black text-lg text-white group-hover:text-orange-500 transition-colors">{product.name}</span>
                    </td>
                    <td className="px-10 py-6">
                      <span className="bg-slate-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-400 border border-slate-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-10 py-6 font-black text-xl text-white">{product.price} <span className="text-[10px] text-slate-500">ETB</span></td>
                    <td className="px-10 py-6 text-right space-x-6">
                      <button onClick={() => openEdit(product)} className="text-orange-500 hover:text-white font-black text-xs uppercase tracking-widest">Edit</button>
                      <button onClick={() => deleteProduct(product.id)} className="text-slate-600 hover:text-red-500 font-black text-xs uppercase tracking-widest">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GLOBAL MODAL (ADD & EDIT) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-[3.5rem] p-12 shadow-2xl">
            <h2 className="text-4xl font-black mb-10 uppercase italic text-orange-500 tracking-tighter">
              {editingProduct ? 'Edit Item' : 'New Dish'}
            </h2>
            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Dish Name</label>
                <input 
                  value={formData.name}
                  className="w-full bg-slate-800 border-2 border-slate-700 p-5 rounded-3xl outline-none focus:border-orange-500 font-bold text-white transition-all"
                  placeholder="e.g. Special Tibs"
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Category</label>
                  <input 
                    value={formData.category}
                    className="w-full bg-slate-800 border-2 border-slate-700 p-5 rounded-3xl outline-none focus:border-orange-500 font-bold text-white transition-all"
                    placeholder="Meat, Veggie..."
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    required
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Price (ETB)</label>
                  <input 
                    value={formData.price}
                    type="number"
                    className="w-full bg-slate-800 border-2 border-slate-700 p-5 rounded-3xl outline-none focus:border-orange-500 font-bold text-white transition-all"
                    placeholder="00"
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Image URL</label>
                <input 
                  value={formData.image}
                  className="w-full bg-slate-800 border-2 border-slate-700 p-5 rounded-3xl outline-none focus:border-orange-500 font-bold text-white transition-all"
                  placeholder="Paste direct link here"
                  onChange={e => setFormData({...formData, image: e.target.value})}
                  required
                />
              </div>

              <div className="flex gap-6 pt-6">
                <button type="button" onClick={closeModal} className="flex-1 text-slate-500 font-black uppercase text-[10px] hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="flex-[2] bg-orange-600 py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all">
                  {editingProduct ? 'Save Changes' : 'Confirm Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;