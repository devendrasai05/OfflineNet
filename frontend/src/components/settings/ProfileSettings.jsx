function ProfileSettings() {
  return (
    <div className="settings-section">
      <div className="settings-section-header">
        <h1>Profile</h1>
        <p>Manage your OfflineNet profile information.</p>
      </div>

      <div className="settings-card">
        <label htmlFor="username">Username</label>
        <input id="username" type="text" placeholder="Username" />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="Email" />

        <button type="button">Save Changes</button>
      </div>
    </div>
  );
}

export default ProfileSettings;