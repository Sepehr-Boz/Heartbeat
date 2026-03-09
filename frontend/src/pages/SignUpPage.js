import "./css/SignUpPage.css";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";



import { db, auth } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import defaultProfilePic from "../components/images/default-profile-pic.png"

import { IsUserLoggedIn, IsAuthOutOfDate } from "../utls/UserChecks.js";


//notification import
import { toast } from 'react-toastify'; 



function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [signedUpUser, setSignedUpUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  // Listen for notifications
  useEffect(() => {
    const checkAuth = async () => {
        const loggedIn = await IsUserLoggedIn();
        const outOfDate = await IsAuthOutOfDate();

        if (outOfDate){
          await auth.signOut();
        }
        else if (loggedIn){
          navigate("/welcome");
        }
    };

    checkAuth();           

  }, []);

  const passwordsMatch = password === confirmPassword;
  const isPasswordValid = password.length >= 8;
  const isEmailValid = email.includes('@') && email.includes('.');

  // Add this test function
  // const testNotification = () => {toast("Test notification from SignUpPage!");};





  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSubmitted(true);

    if (!passwordsMatch) {
      setMessage("Passwords do not match.");
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    } else {
      setMessage("");
    }

    if (!isPasswordValid) {
      setMessage("Password must be at least 8 characters.");
      toast.error("Password is too weak.");

      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      // Aiden: added document creation - NEW
      await setDoc(doc(db, "users", user.uid), {
        username: email.split("@")[0],
        profilePic: defaultProfilePic,
        profile: {},
        preferences: {
          darkMode: false,
          trackSteps: true,
          trackHeartRate: true,
          trackStairsClimbed: false
        }
      });



      setSignedUpUser({ email: user.email, uid: user.uid });
      setMessage("Account created successfully! Please verify your email.");
      
      // Add test notification
      toast.success("Account created successfully");
      
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      navigate("/home");
      
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          toast.error("This email is already registered."); // Add error notification

          break;
        case 'auth/invalid-email':
          toast.error("Invalid email address.");
          break;
        case 'auth/weak-password':
          toast.error("Password is too weak.");
          break;
        default:
          toast.error("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      {header()}
      <main>
        {signedUpUser ? (
          <UserCard user={signedUpUser} onBack={() => setSignedUpUser(null)} />
        ) : (
          <SignUpDetails
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            message={message}
            handleSubmit={handleSubmit}
            passwordsMatch={passwordsMatch}
            loading={loading}
            isEmailValid={isEmailValid}
            isPasswordValid={isPasswordValid}
            submitted={submitted}
          />
        )}
        <LogIn />
      </main>
    </div>
  );
}

function SignUpDetails({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  message,
  handleSubmit,
  passwordsMatch,
  loading,
  isEmailValid,
  isPasswordValid,
  submitted,
}) {
  return (
    <div className="sign-in">
      <form onSubmit={handleSubmit} className="login-form">
        <h3>Sign-Up</h3>
        <h3>Create new account</h3>
        <p></p>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={email.length > 0 ? (isEmailValid ? "input-valid" : "input-invalid") : ""}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={password.length > 0 ? (isPasswordValid ? "input-valid" : "input-invalid") : ""}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={confirmPassword.length > 0 ? (passwordsMatch ? "match-valid" : "match-invalid") : ""}
          required
        />



        <button type="submit" disabled={(!passwordsMatch || loading) && submitted}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>


        {/* Add Test Button */}
        {/* <button 
          type="button" 
          onClick={testNotification}
          style={{ marginTop: '10px' }}
        >
           Test Notification
        </button> */}

        
      </form>

      {message && (
        <p className={message.includes("successfully") ? "message-success" : "message-error"}>
          {message}
        </p>
      )}
    </div>
  );
}

function UserCard({ user, onBack }) {
  return (
    <div className="user-card">
      <h3>Check Your Email!</h3>
      <p className="user-card-email">{user.email}</p>
      <p className="user-card-detail">Your account has been created.</p>
    </div>
  );
}

function header() {
  return (
    <div className="app-header">
      <h1>Heartbeat</h1>
    </div>
  );
}

function LogIn() {
  return (
    <div className="login-form">
      <h3>Click here to Log in</h3>
      <a href="/login">
        <button type="button">Log In</button>
      </a>
    </div>  
  );
}

export default SignUpPage;