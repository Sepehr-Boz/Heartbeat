import { toast } from 'react-toastify';

let pollInterval = null;

export const startPollingNotifications = (userId) => {
  if (!userId) return;
  
  console.log('Starting notification polling for:', userId);
  
  // Poll every 30 seconds
  pollInterval = setInterval(async () => {
    try {
      const response = await fetch(`http://localhost:8000/notifications/${userId}`);
      const notification = await response.json();
      
      if (notification) {
        // Show toast
        if (notification.type === 'warning') {
          toast.warning(
            <div>
              <strong>{notification.title}</strong>
              <p style={{ margin: '5px 0 0 0' }}>{notification.message}</p>
            </div>,
            {
              position: "top-right",
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
            }
          );
        }
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  }, 30000); // Check every 30 seconds
};

export const stopPollingNotifications = () => {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
    console.log('Stopped polling notifications');
  }
};