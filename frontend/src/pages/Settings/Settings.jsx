import { useState } from "react";

import WorkspaceLayout from "../../components/layout/WorkspaceLayout";
import SettingsSidebar from "../../components/settings/SettingsSidebar";
import ProfileSettings from "../../components/settings/ProfileSettings";
import AppearanceSettings from "../../components/settings/AppearanceSettings";
import NotificationSettings from "../../components/settings/NotificationSettings";
import PrivacySettings from "../../components/settings/PrivacySettings";
import AboutSettings from "../../components/settings/AboutSettings";

import "../../styles/settings.css";

function Settings() {
  const [activeSection, setActiveSection] = useState("profile");

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSettings />;

      case "appearance":
        return <AppearanceSettings />;

      case "notifications":
        return <NotificationSettings />;

      case "privacy":
        return <PrivacySettings />;

      case "about":
        return <AboutSettings />;

      default:
        return <ProfileSettings />;
    }
  };

  return (
    <WorkspaceLayout
      sidebar={
        <SettingsSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      }
      sidebarWidth="260px"
    >
      {renderSection()}
    </WorkspaceLayout>
  );
}

export default Settings;