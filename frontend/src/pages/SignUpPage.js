import "./css/SignUpPage.css";
import { useState } from "react";
import { auth, db } from "./firebase/config"; // adjust path as needed
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [signedUpUser, setSignedUpUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!passwordsMatch) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        createdAt: new Date(),
        emailVerified: false
      });

      const newUser = { email, uid: user.uid };
      setUsers([...users, newUser]);
      setSignedUpUser(newUser);
      setMessage("Account created! Please check your email to verify your account.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setMessage("This email is already registered.");
      } else if (error.code === 'auth/weak-password') {
        setMessage("Password should be at least 6 characters.");
      } else {
        setMessage("Error: " + error.message);
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
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  message,
  handleSubmit,
  passwordsMatch,
  submitted,
  loading
}) {
  return (
    <div className="sign-in">
      <form onSubmit={handleSubmit} className="login-form">
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={email.length > 0 ? "input-valid" : "input-invalid"}
          required
          disabled={loading}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={password.length > 0 ? "input-valid" : "input-invalid"}
          required
          disabled={loading}
        />

        {/* confirm password */}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={
            submitted && confirmPassword.length > 0
              ? passwordsMatch
                ? "match-valid"
                : "match-invalid"
              : ""
          }
          required
          disabled={loading}
        />

        {submitted && confirmPassword.length > 0 && (
          <p className={passwordsMatch ? "match-valid" : "match-invalid"}>
            {passwordsMatch ? "✓ Passwords match" : "Passwords do not match"}
          </p>
        )}

        {/* shows if the passwords match post submit */}
        <button type="submit" disabled={!passwordsMatch || loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      {message && (
        <p
          className={
            message.includes("successfully") || message.includes("check your email")
              ? "message-success"
              : "message-error"
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}

function UserCard({ user, onBack }) {
  return (
    <div className="user-card">
      <div className="user-card-icon">✉️</div>
      <h3>Check Your Email!</h3>
      <p className="user-card-email">{user.email}</p>
      <p className="user-card-detail">
        We've sent a verification link to your email address. 
        Please check your inbox and click the link to verify your account.
      </p>
      <p className="user-card-note">
        Don't forget to check your spam folder if you don't see the email.
      </p>
      <button onClick={onBack}>Back to Sign Up</button>
    </div>
  );
}

function LogIn() {
  return (
    <div className="login-form">
      <h3>Already have an account?</h3>
      <a href="/Login">
        <button type="submit">Log In</button>
      </a>
    </div>
  );
}

export default SignUpPage;