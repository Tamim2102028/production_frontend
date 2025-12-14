import React from "react";
import { FaBell, FaCheck } from "react-icons/fa";
import { useAppSelector } from "../store/hooks";
import { NotificationFilters, NotificationItem } from "../components/Notifications";

const Notifications: React.FC = () => {
  const filter = useAppSelector((state) => state.ui.notifications.filter);
  const notifications = useAppSelector(
    (state) => state.notifications.notifications
  );

  const markAsRead = (id: string) => {
    // TODO: Dispatch action to mark single notification as read
    console.log("Mark as read:", id);
  };

  const markAllAsRead = () => {
    // TODO: Dispatch action to mark all as read
    console.log("Mark all as read");
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((notif) => !notif.isRead)
      : notifications;

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 font-medium text-blue-600 cursor-pointer"
          >
            <FaCheck className="h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <NotificationFilters />

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 text-center">
            <FaBell className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No notifications
            </h3>
            <p className="text-gray-500">
              {filter === "unread"
                ? "All caught up! No unread notifications."
                : "You don't have any notifications yet."}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              id={notification.id}
              type={notification.type}
              user={notification.user}
              content={notification.content}
              timestamp={notification.timestamp}
              isRead={notification.isRead}
              postContent={notification.postContent}
              onMarkAsRead={markAsRead}
            />
          ))
        )}
      </div>

      {/* Load More Button */}
      {filteredNotifications.length > 0 && (
        <div className="mt-8 text-center">
          <button className="px-6 py-2 font-medium text-blue-600 hover:text-blue-700">
            Load more notifications
          </button>
        </div>
      )}
    </>
  );
};

export default Notifications;
