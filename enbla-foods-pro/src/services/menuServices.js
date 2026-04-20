// src/services/menuService.js
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Real-time listener for the menu items.
 * @param {Function} callback - Function to run when data changes.
 */
export const subscribeToMenu = (callback) => {
  const q = query(collection(db, "products"), orderBy("name", "asc"));
  
  // onSnapshot is "Real-time" - it is faster and more modern than getDocs
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(items);
  }, (error) => {
    console.error("Firestore Subscription Error:", error);
  });
};