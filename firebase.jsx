// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyCDvEnHfzMQo9FDdJy4Cjz-V4eNzwJjcK8",
  authDomain: "sljj-21b6b.firebaseapp.com",
  projectId: "sljj-21b6b",
  storageBucket: "sljj-21b6b.firebasestorage.app",
  messagingSenderId: "59183929721",
  appId: "1:59183929721:web:891568dc9296875370f7a8",
  measurementId: "G-GXNVPCF8Q2"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyAkbzwrL3ZyqHABhO1KN0vUTZwrOAMK-8Q",
//   authDomain: "kntltd-72386.firebaseapp.com",
//   projectId: "kntltd-72386",
//   storageBucket: "kntltd-72386.firebasestorage.app",
//   messagingSenderId: "715163940620",
//   appId: "1:715163940620:web:d78971b90ce292addc7b29",
//   measurementId: "G-SVGNZ25DVF"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };



