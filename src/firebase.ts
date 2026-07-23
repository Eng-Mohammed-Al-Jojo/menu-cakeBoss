/*----*/

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCG8ngkmqTrtZjGRE0HpAUqQWKawcp9mX8",
  authDomain: "cake-boss-menu.firebaseapp.com",
  databaseURL: "https://cake-boss-menu-default-rtdb.firebaseio.com",
  projectId: "cake-boss-menu",
  storageBucket: "cake-boss-menu.firebasestorage.app",
  messagingSenderId: "138124969829",
  appId: "1:138124969829:web:146cc40d06c167e088438c"
};
const app = initializeApp(firebaseConfig);

// 👇 هذا هو المهم
export const db = getDatabase(app);
export const auth = getAuth(app);
