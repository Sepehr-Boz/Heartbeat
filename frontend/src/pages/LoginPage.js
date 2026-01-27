import logo from '../logo.svg';
import '../App.css';

import { Link } from "react-router-dom";
import { Component } from 'react';


class LoginPage extends Component{
  render(){ return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
        <Link to={"/home"}>HOME LINK</Link>
      </header>
    </div>
  );}
}

export default LoginPage;