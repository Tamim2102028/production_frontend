import React from "react";
import { FaPalette } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setAppTheme, setAppLanguage } from "../../store/slices/uiSlice";
import SettingsItem from "./SettingsItem";

const AppearanceSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const appTheme = useAppSelector((state) => state.ui.settings.appTheme);
  const appLanguage = useAppSelector((state) => state.ui.settings.appLanguage);

  const handleThemeChange = (value: string) => {
    dispatch(setAppTheme(value as "light" | "dark"));
  };

  const handleLanguageChange = (value: string) => {
    dispatch(setAppLanguage(value));
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center space-x-3">
        <FaPalette className="text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Appearance & Language
        </h2>
      </div>
      <div className="space-y-1 divide-y divide-gray-100">
        <SettingsItem
          label="Theme"
          description="Choose your preferred theme"
          action="select"
          value={appTheme}
          options={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
          onSelect={handleThemeChange}
        />
        <SettingsItem
          label="Language"
          description="Select your preferred language"
          action="select"
          value={appLanguage}
          options={[
            { value: "en", label: "English" },
            { value: "es", label: "Español" },
            { value: "fr", label: "Français" },
            { value: "de", label: "Deutsch" },
            { value: "it", label: "Italiano" },
          ]}
          onSelect={handleLanguageChange}
        />
      </div>
    </div>
  );
};

export default AppearanceSettings;
