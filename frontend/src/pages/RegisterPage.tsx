import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';

// Define the shape of the form data
interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const Registration: React.FC = () => {
  const url = process.env.REACT_APP_BACKEND_USER_URL;
  const [data, setData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();

  // Handle input changes
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await axios
        .post(`${url}/register`, {
          email: data.email,
          password: data.password,
        })
        .then((res) => {
          navigate('/login', { state: { success: true } }); // Navigate to login on success
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar currentPage="register" />
      <div className="main-container">
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
            <input
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={changeHandler}
            />
          </div>
          <div className="form-group">
            <input className="btn btn-primary" type="submit" value="Register" />
          </div>
        </form>
        <br />
        <div>
          <p className="alert alert-warning">Existing user? Please login</p>
          <Link to="/login">
            <button className="btn btn-success">Login</button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Registration;