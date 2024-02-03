// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5Xz0yHmK2UnXvZM63mN4AKAGEYtVZgFU",
  authDomain: "chat-web-app-2b863.firebaseapp.com",
  projectId: "chat-web-app-2b863",
  storageBucket: "chat-web-app-2b863.appspot.com",
  messagingSenderId: "596123577806",
  appId: "1:596123577806:web:533b9ebd1acf26991ecf9f"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const  auth = app.auth();
export const db = app.database();
export const storage = app.storage();