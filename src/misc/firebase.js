// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/messaging';
import { getMessaging } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC5Xz0yHmK2UnXvZM63mN4AKAGEYtVZgFU',
  authDomain: 'chat-web-app-2b863.firebaseapp.com',
  projectId: 'chat-web-app-2b863',
  storageBucket: 'chat-web-app-2b863.appspot.com',
  messagingSenderId: '596123577806',
  appId: '1:596123577806:web:533b9ebd1acf26991ecf9f',
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = app.auth();
export const db = app.database();
export const storage = app.storage();

export const messaging = firebase.messaging.isSupported() ? app.messaging() : null;

if(messaging){
  messaging.usePublicVapidKey("BOkEK7UF8eBeDCCpDy36wT14sp2FX007G_LDeZyv4gzT0w3Qu7RGdTfvvyVsNQNWO3srXB-vQuMVoml33laSeUg"); 
  messaging.onMessage(data => {
    console.log(data);
  })
}
