import React, { useState } from "react";
import "./css/Settings.css";

function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch =
    newPassword.length === 0 ||
    confirmPassword.length === 0 ||
    newPassword === confirmPassword;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="settings-container">
        <h2>Settings</h2>

        
        <div className="settings-section">
          <h3>Account</h3>

          <label>Username</label>
          <input
            type="text"
            placeholder="Your username"
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="user@example.com"
            disabled
          />
          
        
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter new email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />


          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={!passwordsMatch ? "input-error" : ""}
          />

          {!passwordsMatch && (
            <small className="error-text">
              Passwords do not match
            </small>
          )}

          <label>GP / Doctor</label>
          <input
            type="text"
            placeholder="Enter your GP or Doctor's name"
          />
        </div>

        
        <div className="settings-section">
          <h3>Preferences</h3>

          <div className="toggle">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            <span>Enable Dark Mode</span>
          </div>
        </div>

        
        <div className="settings-section">
          <h3>Health Tracking</h3>

          <div className="toggle">
            <input type="checkbox" defaultChecked />
            <span>Measure Steps</span>
          </div>

          <div className="toggle">
            <input type="checkbox" defaultChecked />
            <span>Measure Heart Rate</span>
          </div>

          <div className="toggle">
            <input type="checkbox" />
            <span>Measure Stairs Climbed</span>
          </div>
        </div>

        <button
          className="save-btn"
          disabled={!passwordsMatch}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;

