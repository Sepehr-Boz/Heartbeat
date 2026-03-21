import "./css/SignUpPage.css";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";


import TitleBar from "../components/TitleBar.js";
import Divider from "../components/Divider.js";

import { db, auth } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import defaultProfilePic from "../components/images/default-profile-pic.png"

import { IsUserLoggedIn, IsAuthOutOfDate } from "../utls/UserChecks.js";


//notification import
import { toast } from 'react-toastify'; 



function SignUpPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gpName, setGPName] = useState("");
  const [trackSteps, setTrackSteps] = useState(true);
  const [trackDistance, setTrackDistance] = useState(true);
  const [trackCalories, setTrackCalories] = useState(true);
  const [trackHeartRate, setTrackHeartrate] = useState(true);
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
    document.head.getElementsByTagName("title")[0].innerText = "Heartbeat - Sign Up"; 

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
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    } else {
      setMessage("");
    }

    if (!isPasswordValid) {
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
        username: username,
        profilePic: defaultProfilePic,
        profile: {
          gpDoctor: gpName,
        },
        preferences: {
          darkMode: false,
          trackSteps: trackSteps,
          trackHeartRate: trackHeartRate,
          trackStairsClimbed: false,
          trackDistance: trackDistance,
          trackCalories: trackCalories,
        }
      });

      

      setSignedUpUser({ email: user.email, uid: user.uid });
      setMessage("Account created successfully! Please verify your email.");
      
      // Add test notification
      toast.success("Account created successfully");
      
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setGPName("");
      setTrackSteps(false);
      setTrackDistance(false);
      setTrackCalories(false);
      setTrackHeartrate(false);

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
    <>
      {header()}
      <main>
        {signedUpUser ? (
          <UserCard user={signedUpUser} onBack={() => setSignedUpUser(null)} />
        ) : (
          <SignUpDetails
            email={email}
            setEmail={setEmail}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            gpName={gpName}
            setGPName={setGPName}
            trackSteps={trackSteps}
            setTrackSteps={setTrackSteps}
            trackDistance={trackDistance}
            setTrackDistance={setTrackDistance}
            trackCalories={trackCalories}
            setTrackCalories={setTrackCalories}
            trackHeartRate={trackHeartRate}
            setTrackHeartrate={setTrackHeartrate}
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
    </>
  );
}

function SignUpDetails({
  email,
  setEmail,
  username,
  setUsername,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  gpName,
  setGPName,
  trackSteps,
  setTrackSteps,
  trackDistance,
  setTrackDistance,
  trackCalories,
  setTrackCalories,
  trackHeartRate,
  setTrackHeartrate,
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

        <input
          type="email"
          placeholder="Email*"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={email.length > 0 ? (isEmailValid ? "input-valid" : "input-invalid") : ""}
          required
        />

        <Divider />

        <input
          type="text"
          placeholder="Username*"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={username.length > 0 ? "input-valid" : "input-invalid"}
          required
        />

        <input
          type="password"
          placeholder="Password*"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={password.length > 0 ? (isPasswordValid ? "input-valid" : "input-invalid") : ""}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password*"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={confirmPassword.length > 0 ? (passwordsMatch ? "match-valid" : "match-invalid") : ""}
          required
        />

        <Divider />

        <input
          type="text"
          placeholder="GP Name"
          value={gpName}
          onChange={(e) => setGPName(e.target.value)}
          className={"input-valid"}
        />        

        <Divider />

        <div className="checkbox-input">
        <input
          type="checkbox"
          id="track-steps"
          name="track-steps"
          value={trackSteps}
          onChange={() => setTrackSteps(!trackSteps)}
          checked={trackSteps}
        />
        <label htmlFor="track-steps">Track Stepcount</label>
        </div>

        <div className="checkbox-input">
        <input
          type="checkbox"
          id="track-distance"
          name="track-distance"
          value={trackDistance}
          onChange={() => setTrackDistance(!trackDistance)}
          checked={trackDistance}
        />
        <label htmlFor="track-distance">Track Distance Walked</label>
        </div>

        <div className="checkbox-input">
        <input
          type="checkbox"
          id="track-calories"
          name="track-calories"
          value={trackCalories}
          onChange={() => setTrackCalories(!trackCalories)}
          checked={trackCalories}
        />
        <label htmlFor="track-calories">Track Calories Burnt</label>
        </div>

        <div className="checkbox-input">
        <input
          type="checkbox"
          id="track-heartrate"
          name="track-heartrate"
          value={trackHeartRate}
          onChange={() => setTrackHeartrate(!trackHeartRate)}
          className="checkbox-input"
          checked={trackHeartRate}
        />
        <label htmlFor="track-heartrate">Track Heartrate</label>
        </div>


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
    <TitleBar enableBack={false} title={"Create New Account"} />
  );
}

function LogIn() {
  const navigate = useNavigate();

  return (
    <>
      <p style={{fontSize:'12px'}}>Already have an account? <a style={{fontWeight:"bold"}} onClick={() => navigate("/login")}>Login Here</a></p>
    </>
  );
}

export default SignUpPage;