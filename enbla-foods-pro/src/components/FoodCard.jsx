import React from 'react';

const FoodCard = ({ food }) => {
  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
      <div className="h-40 w-full bg-orange-100 rounded-2xl mb-4 overflow-hidden">
        <img src={food.img} alt={food.name} className="w-full h-full object-cover" />
      </div>
      <h3 className="font-bold text-gray-900">{food.name}</h3>
      <div className="flex justify-between items-center mt-2">
        <span className="text-orange-600 font-bold">{food.price} ETB</span>
        <button className="bg-gray-900 text-white p-2 rounded-lg text-xs">+</button>
      </div>
    </div>
  );
};

export default FoodCard;