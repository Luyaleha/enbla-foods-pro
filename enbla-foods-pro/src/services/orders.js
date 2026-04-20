import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const placeOrder = async (cartItems, totalAmount) => {
  try {
    const orderData = {
      items: cartItems,
      total: totalAmount,
      status: "pending",
      createdAt: serverTimestamp(), // Professional way to handle time zones
    };

    const docRef = await addDoc(collection(db, "orders"), orderData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Order Error:", error);
    return { success: false, error };
  }
};