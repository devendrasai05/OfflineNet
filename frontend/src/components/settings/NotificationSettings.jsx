function NotificationSettings() {
  return (
    <div className="settings-content">
      <h1>Notifications</h1>

      <div className="settings-card">
        <label>
          <input type="checkbox" defaultChecked />
          Enable Message Notifications
        </label>
      </div>
    </div>
  );
}

export default NotificationSettings;