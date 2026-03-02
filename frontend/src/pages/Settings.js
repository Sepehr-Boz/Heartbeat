import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateEmail, updatePassword } from "firebase/auth";
import "./css/Settings.css";

function SettingsPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gpDoctor, setGpDoctor] = useState("");
  const [trackSteps, setTrackSteps] = useState(true);
  const [trackHeartRate, setTrackHeartRate] = useState(true);
  const [trackStairsClimbed, setTrackStairsClimbed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const currentUser = auth.currentUser;

  const passwordsMatch =
    newPassword.length === 0 ||
    confirmPassword.length === 0 ||
    newPassword === confirmPassword;

  // Load user data from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) {
        // User not logged in, just use default values
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || "");
          setGpDoctor(userData.profile?.gpDoctor || "");
          setDarkMode(userData.preferences?.darkMode || false);
          setTrackSteps(userData.preferences?.trackSteps ?? true);
          setTrackHeartRate(userData.preferences?.trackHeartRate ?? true);
          setTrackStairsClimbed(userData.preferences?.trackStairsClimbed ?? false);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setMessage("Error loading settings");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [currentUser]);

  
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    
    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [darkMode]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    if (!currentUser) {
      setMessage("Please log in to save settings");
      return;
    }
    
    setSaving(true);
    setMessage("");

    try {
      // Update Firestore document
      const userDocRef = doc(db, "users", currentUser.uid);
      
      await updateDoc(userDocRef, {
        username: username,
        "profile.gpDoctor": gpDoctor,
        "preferences.darkMode": darkMode,
        "preferences.trackSteps": trackSteps,
        "preferences.trackHeartRate": trackHeartRate,
        "preferences.trackStairsClimbed": trackStairsClimbed,
        updatedAt: new Date().toISOString(),
      });



      // Update password if provided
      if (newPassword) {
        if (!passwordsMatch) {
          setMessage("New passwords do not match");
          setSaving(false);
          return;
        }

        await updatePassword(currentUser, newPassword);
        
        setMessage("Password updated successfully!");
        setNewPassword("");
        setConfirmPassword("");
      }

      // If only settings were updated (password change)
      if (!newPassword) {
        setMessage("Settings saved successfully!");
      }
      
    } catch (error) {
      console.error("Error saving settings:", error);
      switch (error.code) {
        case 'auth/requires-recent-login':
          setMessage("Please log out and log back in to change email/password");
          break;
        case 'auth/email-already-in-use':
          setMessage("This email is already in use");
          break;
        case 'auth/weak-password':
          setMessage("Password must be at least 6 characters");
          break;
        default:
          setMessage("Error saving settings: " + error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="settings-page">
        <div className="settings-container">
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <button className="back-arrow" onClick={handleGoBack} aria-label="Go back">
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      <div className="settings-container">
        <h2>Settings</h2>

        
        <div className="settings-section">
          <h3>Account</h3>

          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="current-email">Email</label>
          <input
            id="current-email"
            type="email"
            placeholder="user@example.com"
            value={currentUser?.email || ""}
            disabled
          />
          


          <label htmlFor="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label htmlFor="confirm-password">Confirm New Password</label>
          <input
            id="confirm-password"
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

          <label htmlFor="gp-doctor">GP / Doctor</label>
          <input
            id="gp-doctor"
            type="text"
            placeholder="Enter your GP or Doctor's name"
            value={gpDoctor}
            onChange={(e) => setGpDoctor(e.target.value)}
          />
        </div>

        
        <div className="settings-section">
          <h3>Preferences</h3>

          <div className="toggle">
            <input
              type="checkbox"
              id="dark-mode-toggle"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <label htmlFor="dark-mode-toggle">Enable Dark Mode</label>
          </div>
        </div>

        
        <div className="settings-section">
          <h3>Health Tracking</h3>

          <div className="toggle">
            <input 
              type="checkbox" 
              id="steps" 
              checked={trackSteps}
              onChange={(e) => setTrackSteps(e.target.checked)}
            />
            <label htmlFor="steps">Measure Steps</label>
          </div>

          <div className="toggle">
            <input 
              type="checkbox" 
              id="heart-rate" 
              checked={trackHeartRate}
              onChange={(e) => setTrackHeartRate(e.target.checked)}
            />
            <label htmlFor="heart-rate">Measure Heart Rate</label>
          </div>

          <div className="toggle">
            <input 
              type="checkbox" 
              id="stairs" 
              checked={trackStairsClimbed}
              onChange={(e) => setTrackStairsClimbed(e.target.checked)}
            />
            <label htmlFor="stairs">Measure Stairs Climbed</label>
          </div>
        </div>

        {message && (
          <p className={message.includes("success") ? "message-success" : "message-error"}>
            {message}
          </p>
        )}

        <button
          className="save-btn"
          onClick={handleSave}
          disabled={!passwordsMatch || saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;