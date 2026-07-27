function PrivacySettings() {
  return (
    <div className="settings-content">
      <h1>Privacy</h1>

      <div className="settings-card">
        <label>
          <input type="checkbox" defaultChecked />
          Show Online Status
        </label>
      </div>
    </div>
  );
}

export default PrivacySettings;