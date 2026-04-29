import React, { useState } from 'react';

const CheckoutModal = ({ isOpen, onClose, onConfirm, total, isSubmitting }) => {
  const [customer, setCustomer] = useState({ name: '', phone: '', table: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customer.name.length < 2 || customer.phone.length < 10) {
      alert("Please enter a valid Name and Phone Number");
      return;
    }
    onConfirm(customer);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="bg-orange-600 p-6 text-white text-center">
          <h2 className="text-2xl font-black uppercase tracking-tight">Complete Order</h2>
          <p className="opacity-80 text-sm font-bold mt-1">Total to pay: {total} ETB</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all font-bold"
              placeholder="e.g. Abebe Kebede"
              onChange={(e) => setCustomer({...customer, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Phone Number</label>
            <input 
              required
              type="tel" 
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all font-bold"
              placeholder="0911..."
              onChange={(e) => setCustomer({...customer, phone: e.target.value})}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose} 
              className="flex-1 py-4 text-gray-400 font-bold hover:bg-gray-50 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button 
  type="submit"
  disabled={isSubmitting} 
  className={`flex-[2] py-4 bg-orange-600 text-white font-black rounded-2xl shadow-lg transition-all 
    ${isSubmitting ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:bg-orange-700 active:scale-95'}`}
>
  {isSubmitting ? (
    <span className="flex items-center justify-center gap-2">
      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      PROCESSING...
    </span>
  ) : "CONFIRM ORDER"}
</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;