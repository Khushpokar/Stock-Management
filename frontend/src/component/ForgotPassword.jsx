import React ,{ useEffect} from 'react';
import axios from 'axios'; // Import Axios
import { loadStyles } from './loadstyles';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetMailSchema } from '../utils/Schema'; // Import the schema

const ForgotPassword = () => {
  // Initialize React Hook Form with Zod resolver
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(ResetMailSchema),
    mode: "onChange",
  });

  useEffect(() => {
    // Call loadStyles with an array of paths to your CSS files
    const cleanupStyles = loadStyles();

    // Cleanup the CSS when component is unmounted
    return () => {
      cleanupStyles();
    };
  }, []);

  // Handle form submission
  const onSubmit = async (data) => {
    console.log(data);
    try {
      // Replace with your actual API endpoint
      const response = await axios.post('http://127.0.0.1:8000/checkEmail/', data);
      console.log(response.data);
      console.log(response.data.userid);
      localStorage.setItem('user_id',response.data.userid);
      navigate('/Otp-verify');
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card otp-card border-0 shadow-sm m-5">
        <div className="card-body text-center">
          <h2 className="mb-4 text-light">Trouble logging in?</h2>
          <p className="text-light mb-1">Enter your email and we'll</p>
          <p className="text-light mb-4">send you an OTP to get back into your account.</p>
          <form id="otp-form" onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register('email')}
              className='form-control'
              type='text'
              placeholder='Email'
            />
            {errors.email && <mark className="mt-1 mb-2 text-danger" >{errors.email.message}</mark>}
            <button type="submit" className="btn btn-light w-50">
              Send OTP
            </button>
          </form>
          <p className="mt-3 text-light">
            <a href='/' className="text-light">Back to login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
