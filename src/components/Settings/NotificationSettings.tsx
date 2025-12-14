import React from "react";
import { FaBell } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { updateNotificationSettings } from "../../store/slices/uiSlice";
import SettingsItem from "./SettingsItem";

const NotificationSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state) => state.ui.settings.notifications
  );

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    dispatch(updateNotificationSettings({ [key]: !notifications[key] }));
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center space-x-3">
        <FaBell className="text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
      </div>
      <div className="space-y-1 divide-y divide-gray-100">
        <SettingsItem
          label="Push Notifications"
          description="Receive push notifications on your device"
          action="toggle"
          value={notifications.push}
          onToggle={() => handleNotificationToggle("push")}
        />
        <SettingsItem
          label="Email Notifications"
          description="Receive notifications via email"
          action="toggle"
          value={notifications.email}
          onToggle={() => handleNotificationToggle("email")}
        />
        <SettingsItem
          label="SMS Notifications"
          description="Receive notifications via text message"
          action="toggle"
          value={notifications.sms}
          onToggle={() => handleNotificationToggle("sms")}
        />
        <SettingsItem
          label="Likes"
          description="Get notified when someone likes your content"
          action="toggle"
          value={notifications.likes}
          onToggle={() => handleNotificationToggle("likes")}
        />
        <SettingsItem
          label="Comments"
          description="Get notified about new comments on your posts"
          action="toggle"
          value={notifications.comments}
          onToggle={() => handleNotificationToggle("comments")}
        />
        <SettingsItem
          label="Follows"
          description="Get notified when someone follows you"
          action="toggle"
          value={notifications.follows}
          onToggle={() => handleNotificationToggle("follows")}
        />
        <SettingsItem
          label="Messages"
          description="Get notified about new messages"
          action="toggle"
          value={notifications.messages}
          onToggle={() => handleNotificationToggle("messages")}
        />
        <SettingsItem
          label="In-App Notifications"
          description="Show notifications within the app"
          action="toggle"
          value={notifications.inApp}
          onToggle={() => handleNotificationToggle("inApp")}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;
