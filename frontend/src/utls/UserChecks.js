import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";


function IsUserLoggedIn() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
}


function IsAuthOutOfDate() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();

      if (!user || !user.metadata) {
        resolve(true);
        return;
      }

      const lastSignInDate = Date.parse(user.metadata.lastSignInTime);
      const currentDate = new Date();

      const diffTime = Math.abs(currentDate - lastSignInDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      resolve(diffDays >= 7);
    });
  });
}


export {
    IsUserLoggedIn,
    IsAuthOutOfDate
};