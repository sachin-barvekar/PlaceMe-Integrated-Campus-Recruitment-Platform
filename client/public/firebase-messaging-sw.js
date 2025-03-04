/* eslint-disable */
importScripts(
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js'
)

firebase.initializeApp({
  apiKey: 'AIzaSyA-jLjciD5KFZpAFPLvxoUGRhC-Nr4B2rk',
  authDomain: 'placeme-c7499.firebaseapp.com',
  projectId: 'placeme-c7499',
  storageBucket: 'placeme-c7499.firebasestorage.app',
  messagingSenderId: '971994688281',
  appId: '1:971994688281:web:a71997f38593a34ebc7388',
  measurementId: 'G-5T21QZH7KN'
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  })
})
