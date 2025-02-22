import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

// Define the shape of the form data
interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const url = process.env.REACT_APP_BACKEND_USER_URL;
  const location = useLocation();

  // Access the state passed from the registration page
  const registrationSuccess = location.state?.success;

  const [data, setData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [auth, setAuth] = useState<boolean>(false);

  // Handle input changes
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(`${url}/login`, {
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
        setAuth(true);
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.message);
        } else if (error.request) {
          console.log(error.request);
        } else {
          alert(`Error: ${error.message}`);
        }
        console.log(error.config);
      });
  };

  // Redirect to dashboard if authenticated
  if (auth) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div>
      <Navbar currentPage="login" />
      <div className="main-container">
        {/* For a successful registration, below message is displayed */}
        {registrationSuccess && (
          <div className="alert alert-success">
            Congrats! You are 1 step away to log your tasks. Please login
          </div>
        )}
        <form onSubmit={submitHandler} className="form" autoComplete="off">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              onChange={changeHandler}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={changeHandler}
            />
          </div>
          <div className="form-group">
            <input className="btn btn-primary" type="submit" value="Login" />
          </div>
        </form>
        <br />
        {!registrationSuccess && (
          <div>
            <p className="alert alert-warning">
              First time here? Please create an account and log your tasks
            </p>
            <Link to="/register">
              <button className="btn btn-success">Register</button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Login;