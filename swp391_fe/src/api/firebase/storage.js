// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgCikYWvuteIXMocbXo9I8JY8VHu5itCM",
  authDomain: "swp391-402306.firebaseapp.com",
  projectId: "swp391-402306",
  storageBucket: "swp391-402306.appspot.com",
  messagingSenderId: "992185522488",
  appId: "1:992185522488:web:5b8246f1675583699609cd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
