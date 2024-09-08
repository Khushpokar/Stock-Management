import React, { useState } from 'react';
import './AuthForm.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';  
import { Link, useNavigate } from 'react-router-dom';


function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  // Form fields for Sign Up
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    c_password: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Form fields for Sign In
  const [signInData, setSignInData] = useState({
    username: '',
    password: ''
  });

  const [signInErrors, setSignInErrors] = useState({});


  const handleSignInClick = () => {
    setIsSignUp(true);
    setTimeout(() => {
      document.getElementById("sign_in").style.display = "none";
  }, 200);
  };

  const handleSignUpClick = () => {
    setIsSignUp(false);
    setTimeout(() => {
      document.getElementById("sign_in").style.display="";
  }, 230);
  };
  // Handle input change for Sign Up form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle input change for Sign In form
  const handleSignInInputChange = (e) => {
    const { name, value } = e.target;
    setSignInData({ ...signInData, [name]: value });
  };

  // Email validation function
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle Sign Up
   // Handle Sign Up
   const handleSignUp = () => {
    const newErrors = {};

    if (!formData.firstname) newErrors.firstname = 'First name is required.';
    if (!formData.lastname) newErrors.lastname = 'Last name is required.';
    if (!formData.username) newErrors.username = 'Username is required.';
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (formData.c_password !== formData.password) {
      newErrors.c_password = 'Passwords do not match.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Send the form data to the backend using Axios
      axios.post('http://127.0.0.1:8000/signup/', formData)
        .then(response => {
          // Handle successful response
          setSuccessMessage('Sign Up successful!');
          navigate("/verify");
        })
        .catch(error => {
          if (error.response && error.response.data) {
            const { status } = error.response;
            const newErrors = {};

            if (status === 400) {
              newErrors.c_password = 'Passwords do not match.';
            } else if (status === 409) {
              newErrors.email = error.response.data.error; // Assuming error.response.data.error contains the email error
              newErrors.username = error.response.data.error; // Assuming error.response.data.error contains the username error
            }
            else{
              newErrors.email = error.response.data.error;
            }
            console.log(newErrors);
            setErrors(newErrors);
          } else {
            setErrors({ apiError: 'An error occurred. Please try again later.' });
          }
        });
    }
  };

  // Handle Sign In
  const handleSignIn = () => {
    const newSignInErrors = {};

    // if (!signInData.email) {
    //   newSignInErrors.email = 'Email is required.';
    // } else if (!validateEmail(signInData.email)) {
    //   newSignInErrors.email = 'Invalid email format.';
    // }
    if (!signInData.password) {
      newSignInErrors.password = 'Password is required.';
    }

    setSignInErrors(newSignInErrors);

    if (Object.keys(newSignInErrors).length === 0) {
      // Perform the sign-in logic here
      axios.post('http://127.0.0.1:8000/login/', signInData)
        .then(response => {
          // Handle successful response
          setSuccessMessage('Sign Up successful!');
          navigate("/verify");
        })
        .catch(error => {
          console.log(error);
        });
      console.log('Sign In successful:', signInData);
    }
  };

  return (
    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
      <div className="form-container sign-up-container">
        <form id='sign_up' action="#" onSubmit={(e) => e.preventDefault()}>
          <h2>Create Account</h2>
          <input
            type="text"
            placeholder="First name"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
          />
          {errors.firstname && <p className="error-text">{errors.firstname}</p>}

          <input
            type="text"
            placeholder="Last name"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
          />
          {errors.lastname && <p className="error-text">{errors.lastname}</p>}

          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
          {errors.username && <p className="error-text">{errors.username}</p>}

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          <input
            type="password"
            placeholder="Confirm Password"
            name="c_password"
            value={formData.c_password}
            onChange={handleInputChange}
          />
          {errors.c_password && <p className="error-text">{errors.c_password}</p>}
          {errors.apiError && <p className="error-text">{errors.apiError}</p>}
          {successMessage && <p className="success-text">{successMessage}</p>}
          <button type="button" className="co" onClick={handleSignUp}>Sign Up</button>
          
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form id='sign_in' action="#" onSubmit={(e) => e.preventDefault()}>
          <h2>Sign in</h2>
          <input
            type="text"
            placeholder="Username Or Email"
            name="username"
            value={signInData.username}
            onChange={handleSignInInputChange}
          />
          {signInErrors.email && <p className="error-text">{signInErrors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={signInData.password}
            onChange={handleSignInInputChange}
          />
          {signInErrors.password && <p className="error-text">{signInErrors.password}</p>}

          <a href="#">Forgot your password?</a>
          <button type="button" className="co" onClick={handleSignIn}>Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h2>Welcome Back!</h2>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" onClick={handleSignUpClick}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h2>Hello, Friend!</h2>
            <p>Enter your personal details and start your journey with us</p>
            <button className="ghost" onClick={handleSignInClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
