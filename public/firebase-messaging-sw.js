importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBVj-2JfKUr58-EB-eDeuMnnDfIbbnjqj8",
  authDomain: "admin-panel-daebe.firebaseapp.com",
  databaseURL: "https://admin-panel-daebe-default-rtdb.firebaseio.com",
  projectId: "admin-panel-daebe",
  storageBucket: "admin-panel-daebe.firebasestorage.app",
  messagingSenderId: "899782782782",
  appId: "1:899782782782:web:58afdf532d5c025088466f",
  measurementId: "G-HP29B7D93B"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
