function ProfileSettings() {
  return (
    <div className="settings-content">
      <h1>Profile</h1>

      <div className="settings-card">
        <label>Username</label>
        <input type="text" placeholder="Username" />

        <label>Email</label>
        <input type="email" placeholder="Email" />

        <button>Save Changes</button>
      </div>
    </div>
  );
}

export default ProfileSettings;