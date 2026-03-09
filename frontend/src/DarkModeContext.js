import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from './config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load dark mode preference from Firestore when user logs in
  useEffect(() => {
    const loadDarkModePreference = async (user) => {
      if (user) {
        setIsLoggedIn(true);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const savedDarkMode = userData.preferences?.darkMode || false;
            setDarkMode(savedDarkMode);
            // Keep localStorage in sync
            localStorage.setItem('darkMode', savedDarkMode);
          } else {
            // User exists but no Firestore doc yet, load from localStorage
            const saved = localStorage.getItem('darkMode');
            setDarkMode(saved === 'true');
          }
        } catch (error) {
          console.error("Error loading dark mode preference:", error);
          // Fallback to localStorage
          const saved = localStorage.getItem('darkMode');
          setDarkMode(saved === 'true');
        }
      } else {
        // User logged out - turn off dark mode
        setIsLoggedIn(false);
        setDarkMode(false);
        localStorage.setItem('darkMode', 'false');
      }
      
      setLoading(false);
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      loadDarkModePreference(user);
    });

    return () => unsubscribe();
  }, []);

  // Apply dark mode class to body AND save to localStorage
  useEffect(() => {
    if (darkMode && isLoggedIn) {
      document.body.classList.add("dark-mode");
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem('darkMode', 'false');
    }

    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, [darkMode, isLoggedIn]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode, loading }}>
      {children}
    </DarkModeContext.Provider>
  );
};