import React from 'react';
import axios from 'axios';

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const markAsRead = async () => {
    try {
      await axios.post(`/api/notifications/markAsRead`, { id: notification.id });
      // Handle successful marking as read
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className={`p-4 mb-2 rounded ${notification.read ? 'bg-gray-100' : 'bg-blue-100'}`}>
      <p>{notification.message}</p>
      <p className="text-sm text-gray-500">
        {new Date(notification.createdAt).toLocaleDateString()}
      </p>
      {!notification.read && (
        <button onClick={markAsRead} className="text-sm text-blue-500 mt-2">
          Mark as read
        </button>
      )}
    </div>
  );
};

export default NotificationItem;