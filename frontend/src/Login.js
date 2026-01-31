import './login.css';
import { useState } from 'react';



function Login() {
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
    <div className="App">
      <header className="App-header">
        <h2>Login</h2>

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

          <button type="submit">Log In</button>
        </form>



        {message && <p>{message}</p>}
      </header>
    </div>
  );
}


function Startpage() {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <div className="App" onClick={() => setShowLogin(true)} style={{ cursor: "pointer" }}>
      {!showLogin ? (
        <header className="App-login-reveal">
          <h1>Press anywhere to continue</h1>
        </header>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default Startpage;
