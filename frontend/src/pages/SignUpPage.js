import "./css/SignUpPage.css";
import { useState } from "react";
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function SignUpPage() {


// all the consts and rules and event handlers

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  //const [users, setUsers] = useState([]);
  const [signedUpUser, setSignedUpUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // information which i will add for later use
  // const [Username, setUsername] = useState("");
  // const [userAge, setUserAge] = useState("");
  // const [GPname, setGPname] = useState("");
  // const [trackSteps, setTrackSteps] = useState(false);
  // const [trackHeartRate, setTrackHeartRate] = useState(false);
  // const [trackCalories, setTrackCalories] = useState(false);



  const passwordsMatch = password === confirmPassword;
  const isPasswordValid = password.length >= 6;




  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!passwordsMatch) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!isPasswordValid) {
      setMessage("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try{
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setSignedUpUser({ email: user.email, uid: user.uid})
      setMessage("Account created successfully!");
      
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          setMessage("This email is already registered.");
          break;
        case "auth/invalid-email":
          setMessage("Invalid email format.");
          break;
        case "auth/weak-password":
          setMessage("Password must be at least 6 characters long.");
          break;
        default:
          setMessage("Error creating account: " + error.message);
      }
    }finally {
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
            email={email}   setEmail={setEmail}
            password={password}    setPassword={setPassword}
            confirmPassword={confirmPassword}    setConfirmPassword={setConfirmPassword}

            message={message}    
            handleSubmit={handleSubmit}
            passwordsMatch={passwordsMatch}
            isPasswordValid={isPasswordValid}
            loading={loading}
          />

        )}

        <LogIn />
        
      </main>
    </div>
  );
}



function header() {
  return (
    <div className="app-header">
      <h1>Heartbeat</h1>
      <h3>Sign-Up</h3>
      <p>Create new account</p>
    </div>
  );
}



function SignUpDetails({
  email, setEmail,
  password, setPassword,
  confirmPassword, setConfirmPassword,

  message, 
  handleSubmit,
  passwordsMatch,
  isPasswordValid,
  loading
})


    {
      const isEmailValid = email.includes('@') && email.includes('.');
      const showPasswordError = password.length > 0 && !isPasswordValid;
      const showMatchError = confirmPassword.length > 0 && !passwordsMatch;

      return (
        <div className="sign-in">
          <form onSubmit={handleSubmit} className="login-form">

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={email.length > 0 ? (isEmailValid ? "input-valid" : "input-invalid") : ""}
              required
            />
            {email.length > 0 && !isEmailValid && (
          <p className="field-error">Please enter a valid email</p>
        )}



            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={password.length > 0 ? (isPasswordValid ? "input-valid" : "input-invalid") : ""}
              required
            />
            {showPasswordError && (
              <p className="field-error">Password must be at least 6 characters long.</p>
            )}

            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={confirmPassword.length > 0 ? (passwordsMatch ? "input-valid" : "input-invalid") : ""}
              required
            />

            {/* Match Feedback */}
            {confirmPassword.length > 0 && (
              <p className={passwordsMatch ? "match-valid" : "match-invalid"}>
                {passwordsMatch ? "✓ Passwords match" : "Passwords do not match"}
              </p>
            )}

          <button 
          type="submit" 
          disabled={!passwordsMatch || !isPasswordValid || loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
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
      <div className="user-card-icon">✓</div>
      <h3>Welcome!</h3>
      <p className="user-card-email">{user.email}</p>
      <p className="user-card-detail">Your account has been created.</p>
      <p className="user-card-detail">User ID: {user.uid}</p>



      <button onClick={onBack}>Back to Sign Up</button>


    </div>
  );
}


function LogIn() {
  return (
    <div className="user-card">
      <div className="login-prompt">
        <h3>Already have an account?</h3>
          <p>Sign in to continue with your existing account.</p>

        <a href="/Login">
          <button type="submit">Log In</button>
        </a>
      </div>
    </div>
  );

}


export default SignUpPage;