export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-6 bg-white shadow-sm sticky top-0 z-50">
      <h1 className="text-2xl font-black text-orange-600">ENBLA</h1>
      <div className="space-x-8 font-medium text-gray-600 hidden md:flex">
        <a href="#" className="hover:text-orange-600">Home</a>
        <a href="#" className="hover:text-orange-600">Menu</a>
        <a href="#" className="hover:text-orange-600">Orders</a>
      </div>
      <button className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-700 transition">
        Login
      </button>
    </nav>
  );
}