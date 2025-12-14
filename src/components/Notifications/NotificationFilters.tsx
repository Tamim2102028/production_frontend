import React from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setNotificationFilter } from "../../store/slices/uiSlice";

const NotificationFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.ui.notifications.filter);
  const notifications = useAppSelector(
    (state) => state.notifications.notifications
  );

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return (
    <div className="mb-6 flex border-b border-gray-200">
      <button
        onClick={() => dispatch(setNotificationFilter("all"))}
        className={`px-4 py-2 text-sm font-medium ${
          filter === "all"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        All
      </button>
      <button
        onClick={() => dispatch(setNotificationFilter("unread"))}
        className={`px-4 py-2 text-sm font-medium ${
          filter === "unread"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Unread {unreadCount > 0 && `(${unreadCount})`}
      </button>
    </div>
  );
};

export default NotificationFilters;
