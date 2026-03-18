import './css/LoginPage.css';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { IsUserLoggedIn, IsAuthOutOfDate } from '../utls/UserChecks';
import {toast} from 'react-toastify';

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;
      setUser(loggedInUser);
      console.log(userCredential);
      // setUser(loggedInUser);
      // console.log(user);
      setMessage("Login successful");
      toast.success("Login successful");

      // if successful then navigate to the home page
      navigate("/home");

    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          setMessage("No account found with this email.");
          toast.error("No account found with this email.");
          break;
        case "auth/wrong-password":
          setMessage("Incorrect password.");
          toast.error("Incorrect password.");
          break;
        case 'auth/invalid-email':
          setMessage("Invalid email address.");
          toast.error("Invalid email address.");
          break;
        case 'auth/invalid-credential':
          setMessage("Invalid email or password.");
          toast.error("Invalid email or password.");
          break;
        case 'auth/too-many-requests':
          setMessage("Too many failed attempts. Please try again later.");
          toast.error("Too many failed attempts. Please try again later.");
          break;
        default:
          setMessage("Login failed: " + error.message);
          toast.error("Login failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }

  };


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
    document.head.getElementsByTagName("title")[0].innerText = "Heartbeat - Login";
  }, []);

  return (
    <div className="App ">
      {header()}
      <main >
        {user ? (
          <div className="user-card">
            <div className="user-card-icon">✓</div>
            <h3>Welcome back!</h3>
            <p className="user-card-email">{user.email}</p>
            <p className="user-card-detail">You are now logged in.</p>
            <br />
            <HomePage />
            <br />
             <div className="login-form">
            <button onClick={() => { setUser(null); setEmail(""); setPassword(""); }}>
              Log Out
            </button>
            </div>
            </div>
           
        ) : (
          <SignInDetails 
            email={email} 
            setEmail={setEmail} 
            password={password} 
            setPassword={setPassword}
            message={message} 
            handleSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </main>
      
    </div>
  );
}





function header() {
   return (
    <div className="app-header">
      <h1>Heartbeat</h1>
      <h3>Enter your email or sign-up</h3>
    </div>
  );
}





function SignInDetails({ email, setEmail, password, setPassword, message ,handleSubmit, loading }) {
  return (
    <div className="sign-in">
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* changed login button to submit and not button */}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      
      {message && (
        <p className={message.includes("successful") ? "message-success" : "message-error"}>
          {message}
        </p>
      )}

      <br />
      <SignUp />
    </div>
  );
}


function HomePage() {
  return (
    <div className="login-form">

      <h3>click here to go to your HomePage</h3>
      <a href="/Home">
        <button type="button">Home</button>
      </a>

    </div>
  );
}


function SignUp() {
  return (


    <div className="login-form">

      <h3>Don't have an account?</h3>
      <a href="/Signup">
        <button type="button">Sign Up</button>
      </a>

    </div>
  );
}






export default LoginPage;
