import './css/LoginPage.css';
import { useState } from 'react';
import SignUpPage from './SignUpPage';



function LoginPage() {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = (e) => {
    //this part is just a mockup, replace with the authentication and the login from the database
    e.preventDefault();

    if (email === "user@example.com" && password === "password") {
      setMessage("Login successful");
    } else {
      setMessage("Invalid email or password");
    }

  };



  return (
    <div className="App ">
      {header()}
      <main >
        {SignInDetails({ email, setEmail, password, setPassword,message, handleSubmit })}
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





function SignInDetails({ email, setEmail, password, setPassword, message ,handleSubmit }) {
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

      <button type="button">Log In</button>
    </form>
    {message && <p>{message}</p>}

    <br></br>
    {SignUp()}
    
      
 
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

