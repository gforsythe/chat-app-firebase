
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');


firebase.initializeApp({
  apiKey: 'AIzaSyC5Xz0yHmK2UnXvZM63mN4AKAGEYtVZgFU',
  authDomain: 'chat-web-app-2b863.firebaseapp.com',
  databaseURL: "https://chat-web-app-2b863-default-rtdb.firebaseio.com",
  projectId: 'chat-web-app-2b863',
  storageBucket: 'chat-web-app-2b863.appspot.com',
  messagingSenderId: '596123577806',
  appId: '1:596123577806:web:533b9ebd1acf26991ecf9f',
});
 firebase.messaging();