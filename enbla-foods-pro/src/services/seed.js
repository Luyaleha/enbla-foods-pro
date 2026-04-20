import { db } from "./firebase";
import { collection, writeBatch, doc } from "firebase/firestore";
import { MENU_DATA } from "../constants/menuData";

export const seedDatabase = async () => {
  const batch = writeBatch(db);
  const productsRef = collection(db, "products");

  MENU_DATA.forEach((item) => {
    // Create a new document reference with an auto-generated ID
    const newDocRef = doc(productsRef); 
    batch.set(newDocRef, item);
  });

  try {
    await batch.commit();
    console.log("✅ SUCCESS: Full menu uploaded to Firestore!");
    alert("Full Menu Seeded! You can now comment out the seed line.");
  } catch (error) {
    console.error("❌ BATCH ERROR: ", error);
  }
};