
/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBuh0CKL5VqTmX0RcsRGzzwfDW67t5wSbo",
  authDomain: "heartbeat-781e3.firebaseapp.com",
  projectId: "heartbeat-781e3",
  storageBucket: "heartbeat-781e3.firebasestorage.app",
  messagingSenderId: "123602565832",
  appId: "1:123602565832:web:1f41145fcf001b115bc3fd",
  measurementId: "G-G3QNSKH6WW"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background notification received:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});