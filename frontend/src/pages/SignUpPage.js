import "./css/SignUpPage.css";
import { useState } from "react";

function SignUpPage() {


// all the consts and rules and event handlers

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [signedUpUser, setSignedUpUser] = useState(null);


  // information which i will add for later use
  // const [Username, setUsername] = useState("");
  // const [userAge, setUserAge] = useState("");
  // const [GPname, setGPname] = useState("");
  // const [trackSteps, setTrackSteps] = useState(false);
  // const [trackHeartRate, setTrackHeartRate] = useState(false);
  // const [trackCalories, setTrackCalories] = useState(false);



  const passwordsMatch = password === confirmPassword;





  const handleSubmit = (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      setMessage("Passwords do not match.");
      return;
    }

    if (users.find((u) => u.email === email)) {
      setMessage("This email is already registered.");
      return;
    }

    const newUser = { email, password };
    setUsers([...users, newUser]);
    setSignedUpUser(newUser);
    setMessage("Account created successfully!");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
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
      <p>Create old new account</p>
    </div>
  );
}



function SignUpDetails({
  email, setEmail,
  password, setPassword,
  confirmPassword, setConfirmPassword,

  message, 
  handleSubmit,
  passwordsMatch
})


    {

      return (
        <div className="sign-in">
          <form onSubmit={handleSubmit} className="login-form">

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={email.rules > 0 ? "input-valid" : "input-invalid"}
              required
            />



            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={password.rules > 0 ? "input-valid" : "input-invalid"}
              required
            />



            {/* Confirm Password */}
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={confirmPassword.length > 0 ? (passwordsMatch ? "match-valid" : "match-invalid") : ""}
              required
            />

            {/* Match Feedback */}
            {confirmPassword.length > 0 && (
              <p className={passwordsMatch ? "match-valid" : "match-invalid"}>
                {passwordsMatch ? "✓ Passwords match" : "Passwords do not match"}
              </p>
            )}

            <button type="submit" disabled={!passwordsMatch}>
              Sign Up
            </button>
          </form>

          {message && <p className={message.includes("successfully") ? "message-success" : "message-error"}>{message}</p>}
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