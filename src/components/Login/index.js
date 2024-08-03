import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const Login = () => {
  const [register, setRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessageRegister, setErrorMessageRegister] = useState('');

  const registerUser = () => {
    setRegister(true);
  };

  const loginUser = () => {
    setRegister(false);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNewUsernameChange = (e) => {
    setNewUserName(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewUserPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    const data = { username, password };
    if (username.length === 0) {
      console.log("Username cannot be empty");
      setErrorMessage("Username cannot be empty");
      return;
    }
    if (password.length === 0) {
      console.log("Password cannot be empty");
      setErrorMessage("Password cannot be empty");
      return;
    }

    const url = "https://clawn-backendprojk.netlify.app/login";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(url, options);
    const responseToJson = await response.json();

    if (response.ok) {
      console.log("Login successful");
      console.log(response);
      console.log(responseToJson);
      console.log(responseToJson.jwtToken);
      const { id, jwtToken, role, username } = responseToJson;
      localStorage.setItem('user', JSON.stringify({ id, jwtToken, role, username }));
      localStorage.setItem("loginTime", new Date().toString());
      console.log("loginTime", localStorage.getItem("loginTime"));
      Cookies.set("jwtToken", responseToJson.jwtToken, { expires: 30 });
    } else {
      console.log("Login failed", response);
      console.log(responseToJson);
      setErrorMessage(responseToJson.errorMessage);
    }
  };

  const submitNewUserDetails = async (e) => {
    e.preventDefault();
    const data = { username: newUserName, password: newUserPassword };
    if (newUserName.length === 0) {
      console.log("Username cannot be empty");
      setErrorMessageRegister("Username cannot be empty");
      return;
    }
    if (newUserPassword.length === 0) {
      console.log("Password cannot be empty");
      setErrorMessageRegister("Password cannot be empty");
      return;
    }
    if (confirmPassword.length === 0) {
      console.log("Confirm Password cannot be empty");
      setErrorMessageRegister("Confirm Password cannot be empty");
      return;
    }
    if (newUserPassword !== confirmPassword) {
      console.log("Passwords do not match");
      setErrorMessageRegister("Passwords do not match");
      return;
    }

    const url = "https://clawn-backendprojk.netlify.app/register";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };

    const response = await fetch(url, options);
    const responseToJson = await response.json();

    if (response.ok) {
      console.log("Registration successful");
      setNewUserName("");
      setNewUserPassword("");
      setConfirmPassword("");
      setErrorMessageRegister("");
      setRegister(false);
    } else {
      console.log("Registration failed");
      setErrorMessageRegister(responseToJson.errorMessage);
    }
  };

  return (
    <div className="login-and-register">
      <div id="formContainer">
        {register === false ? (
          <div>
            <form onSubmit={submitLogin} className="form">
              <h2>Login</h2>
              <div className="form-group">
                <label htmlFor="loginUsername">Username:</label>
                <input value={username} onChange={handleUsernameChange} type="text" id="loginUsername" name="username" required />
              </div>
              <div className="form-group">
                <label htmlFor="loginPassword">Password:</label>
                <input value={password} onChange={handlePasswordChange} type="password" id="loginPassword" name="password" required />
              </div>
              <div className="form-group">
                <button className="login-button" type="submit">Login</button>
              </div>
              <div id="loginErrorMessage" className="error-message">{errorMessage}</div>
              <p>Don't have an account? <span onClick={registerUser} id="showRegisterForm">Register</span></p>
            </form>
          </div>
        ) : (
          <div>
            <form onSubmit={submitNewUserDetails} id="registerForm" className="form">
              <h2>Register</h2>
              <div className="form-group">
                <label htmlFor="registerUsername">Username:</label>
                <input value={newUserName} onChange={handleNewUsernameChange} type="text" id="registerUsername" name="username" required />
              </div>
              <div className="form-group">
                <label htmlFor="registerPassword">Password:</label>
                <input value={newUserPassword} onChange={handleNewPasswordChange} type="password" id="registerPassword" name="password" required />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input value={confirmPassword} onChange={handleConfirmPasswordChange} type="password" id="confirmPassword" name="confirmPassword" required />
              </div>
              <div className="form-group">
                <button className="register-button" type="submit">Register</button>
              </div>
              <div id="registerErrorMessage" className="error-message">{errorMessageRegister}</div>
              <p>Already have an account? <span onClick={loginUser} id="showLoginForm">Login</span></p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
