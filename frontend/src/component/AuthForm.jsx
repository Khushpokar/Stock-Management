import React, { useState } from 'react';
import axios from 'axios';  
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpSchema , LoginSchema } from '../utils/Schema';
import { useEffect } from 'react';
import { loadStyles } from './loadstyles';


function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Call loadStyles with an array of paths to your CSS files
    const cleanupStyles = loadStyles();

    // Cleanup the CSS when component is unmounted
    return () => {
      cleanupStyles();
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isSignUp ? SignUpSchema : LoginSchema),
    mode:"onChange"
  });

  
  

  const handleSignInClick = () => {
    setIsSignUp(true);
    setErrorMessage("");
    setTimeout(() => {
      document.getElementById("sign_in").style.display = "none";
  }, 200);
  };

  const handleSignUpClick = () => {
    setIsSignUp(false);
    setErrorMessage("");
    setTimeout(() => {
      document.getElementById("sign_in").style.display="";
  }, 230);
  };


  const onSubmit = async (data) => {
    try {
      console.log(data);
      const response = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/signup/',
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            firstname:data.firstname,
            lastname:data.lastname,
            username:data.username,
            email:data.email,
            password:data.password,
        },
    });
    console.log(response.status);
      if (response.status === 201) {
        // setErrorMessage(''); 
        localStorage.setItem('user_id', response.data.userid);
        console.log('Success:', response.data);
        navigate('/verify');
      }
    } catch (error) {
      if (error.response.status === 409) {
        setErrorMessage('Email or Username is already registered.');
        console.log(error.message);
      } else {
        console.error('Error:', error.message);
      }
    }
  };
  // Handle Sign In
  const onSubmitlogin = async (data) => {
    try {
      // Send the form data to the backend using Axios
      console.log(data);
      localStorage.clear();
      const response = await axios.post('http://127.0.0.1:8000/login/', data);
      // Handle successful response
      console.log('Sign In successful:', response.data);
      localStorage.setItem("user_id", response.data.userid);
      if(response.status === 201)
      {
        navigate('/verify');
      }
      if(response.status === 200){
        console.log(response.data.token);
        localStorage.setItem('token',response.data.token);
      }
    } catch (error) {
      // Log the entire error to understand its structure

      const newErrors = {};

      if (error.response) {
        const { status, data } = error.response;
        setErrorMessage(data.error);
       
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later.');
      }

     
    }
  };

  return (
    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
      <div className="form-container sign-up-container">
        <form id='sign_up' action="#" onSubmit={handleSubmit(onSubmit)}>
        <h2>Create Account</h2>
          <input
            type="text"
            placeholder="First name"
            {...register('firstname')}
          />
          {errors.firstname && <p className="error-text">{errors.firstname.message}</p>}

          <input
            type="text"
            placeholder="Last name"
            {...register('lastname')}
          />
          {errors.lastname && <p className="error-text">{errors.lastname.message}</p>}

          <input
            type="text"
            placeholder="Username"
            {...register('username')}
          />
          {errors.username && <p className="error-text">{errors.username.message}</p>}

          <input
            type="email"
            placeholder="Email"
            {...register('email')}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Password"
            {...register('password')}
          />
          {errors.password && <p className="error-text">{errors.password.message}</p>}

          <input
            type="password"
            placeholder="Confirm Password"
            {...register('c_password')}
          />
          {errors.c_password && <p className="error-text">{errors.c_password.message}</p>}
          {/* {errors.apiError && <p className="error-text">{errors.apiError}</p>} */}
          {errorMessage && (
                    <div className="text-danger mt-1 mb-2" style={{ fontSize: 'small' }}>
                        {errorMessage}
                    </div>
                    )}
          <button type="submit" className="co">Sign Up</button>
          
        </form>
      </div>
      <div className="form-container sign-in-container">
        <form id='sign_in' action="#" onSubmit={handleSubmit(onSubmitlogin)}>
         <h2>Sign In</h2>
          <input
            type="text"
            placeholder="Username Or Email"
            {...register('emailOrUsername')}
          />
          {errors.emailOrUsername && <p className="error-text">{errors.emailOrUsername.message}</p>}

          <input
            type="password"
            placeholder="Password"
            {...register('passwords')}
          />
          {errors.passwords && <p className="error-text">{errors.passwords.message}</p>}
          {errorMessage && (
                    <div className="text-danger mt-1 mb-2" style={{ fontSize: 'small' }}>
                        {errorMessage}
                    </div>
                    )}
          <a href="forgot-password">Forgot your password?</a>

          <button type="submit" className="co">Sign In</button>
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
