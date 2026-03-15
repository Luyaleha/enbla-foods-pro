export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Food Menu', icon: '🍴' },
    { name: 'Order List', icon: '📋' },
    { name: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 flex-col p-6 sticky top-0 h-screen">
      <div className="mb-10 px-2">
        <h2 className="text-2xl font-black text-orange-600 tracking-tighter">ENBLA FOODS</h2>
      </div>
      
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <button key={item.name} className="flex items-center gap-4 w-full p-4 rounded-2xl text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-all font-bold">
            <span>{item.icon}</span>
            {item.name}
          </button>
        ))}
      </nav>

      <div className="bg-orange-600 rounded-3xl p-6 text-white text-center">
        <p className="text-sm opacity-80 mb-4">Get 20% discount on your first order!</p>
        <button className="bg-white text-orange-600 w-full py-2 rounded-xl font-bold text-sm">Order Now</button>
      </div>
    </aside>
  );
}