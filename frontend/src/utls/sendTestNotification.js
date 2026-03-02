// src/utils/sendTestNotification.js
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Paste your Server Key from Step 1.3 here
const SERVER_KEY = 'YOUR_SERVER_KEY_HERE';

export const sendTestNotification = async (userId) => {
  try {
    // Get user's FCM token from Firestore
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      alert('User not found in database!');
      return;
    }
    
    const userData = userDoc.data();
    
    if (!userData.fcmToken) {
      alert('No FCM token found! Please enable notifications first.');
      return;
    }

    console.log('Sending notification to token:', userData.fcmToken);

    // Send notification via FCM API
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${SERVER_KEY}`
      },
      body: JSON.stringify({
        to: userData.fcmToken,
        notification: {
          title: 'Test Notification 🔔',
          body: 'This is a test from Heartbeat!',
          icon: '/logo192.png',
          click_action: window.location.origin
        }
      })
    });

    const result = await response.json();
    console.log('FCM Response:', result);
    
    if (result.success === 1) {
      alert('Notification sent successfully!');
    } else {
      alert('Failed to send notification. Check console for details.');
      console.error('Error:', result);
    }
    
  } catch (error) {
    console.error('Error sending notification:', error);
    alert('Error: ' + error.message);
  }
};