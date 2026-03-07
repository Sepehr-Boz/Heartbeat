


























// // src/services/notificationService.js
// import { messaging, db } from '../config/firebase';
// import { getToken, onMessage } from 'firebase/messaging';
// import { doc, setDoc } from 'firebase/firestore';

// const VAPID_KEY = 'BDxh4GFpw_J3RJO5  UjFzJMMpv5dEzaB34TrRmDA7H03Vc5-kS4RwAEYygPWzF59WdsWJvBDadyJFsSO6RQWn7vI ';

// /**
//  * Request notification permission and save token to Firestore
//  */
// export const enableNotifications = async (userId) => {
//   try {
//     // Check if browser supports notifications
//     if (!('Notification' in window)) {
//       console.error('This browser does not support notifications');
//       return null;
//     }

//     // Request permission
//     const permission = await Notification.requestPermission();
    
//     if (permission === 'granted') {
//       console.log('Notification permission granted');
      
//       // Get FCM token
//       const token = await getToken(messaging, { vapidKey: VAPID_KEY });
      
//       if (token) {
//         console.log('FCM Token:', token);
        
//         // Save token to Firestore
//         await setDoc(doc(db, 'users', userId), {
//           fcmToken: token,
//           notificationsEnabled: true,
//           createdAt: new Date()
//         }, { merge: true });
        
//         return token;
//       } else {
//         console.error('No FCM token received');
//         return null;
//       }
//     } else {
//       console.log('Notification permission denied');
//       return null;
//     }
//   } catch (error) {
//     console.error('Error enabling notifications:', error);
//     return null;
//   }
// };

// /**
//  * Listen for foreground notifications
//  */
// export const listenForNotifications = (callback) => {
//   onMessage(messaging, (payload) => {
//     console.log('Foreground notification received:', payload);
    
//     // Show browser notification
//     if (payload.notification) {
//       new Notification(payload.notification.title, {
//         body: payload.notification.body,
//         icon: '/logo192.png'
//       });
//     }
    
//     // Call callback if provided
//     if (callback) {
//       callback(payload);
//     }
//   });
// };