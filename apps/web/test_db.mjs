import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, orderBy } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  try {
    const snap = await getDocs(query(collection(db, "testimonials"), where("published", "==", true), orderBy("order", "asc")));
    console.log("Empty:", snap.empty);
    snap.forEach(d => console.log(d.id, d.data()));
  } catch(e) {
    console.error("ERROR:", e.message);
  }
}
run();
