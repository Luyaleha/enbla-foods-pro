export default function FoodCard({ food, onAdd }) {
  return (
    <div className="bg-white p-4 rounded-[32px] shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-orange-100 group">
      <div className="relative aspect-square w-full mb-4 overflow-hidden rounded-[24px]">
        <img src={food.img} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt={food.name} />
      </div>
      <h3 className="text-lg font-black text-gray-900 leading-tight">{food.name}</h3>
      <div className="flex justify-between items-center mt-4">
        <span className="text-xl font-black text-orange-600">{food.price} <small className="text-xs">ETB</small></span>
        <button 
          onClick={onAdd}
          className="bg-gray-900 text-white h-12 w-12 rounded-2xl flex items-center justify-center hover:bg-orange-600 transition-colors shadow-lg active:scale-95"
        >
          +
        </button>
      </div>
    </div>
  );
}