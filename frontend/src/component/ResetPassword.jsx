import React ,{useEffect} from 'react';
import axios from 'axios'; // Import Axios
import { loadStyles } from './loadstyles';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetPasswordSchema } from '../utils/Schema'; // Import the schema
import { Link, useNavigate } from 'react-router-dom';


const ResetPassword =()=>{
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(ResetPasswordSchema),
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

    const navigate = useNavigate()
      // Handle form submission
      const onSubmit = async (data) => {
        data.user_id=localStorage.getItem('user_id');

        console.log(data);
        try {
          // Replace with your actual API endpoint
          const response = await axios.post('http://127.0.0.1:8000/resetPassword/', data);
          console.log(response.data);
          navigate("/")
        } catch (error) {
          console.error('Error sending OTP:', error);
        }
      };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
          <div className="card otp-card border-0 shadow-sm m-5">
            <div className="card-body text-center">
              <h2 className="mb-4 text-light">Reset Your Password</h2>
              <p className="text-light mb-1">Enter your email and we'll</p>
              <p className="text-light mb-4">send you an OTP to get back into your account.</p>
              <form id="otp-form" onSubmit={handleSubmit(onSubmit)}>
                <input
                  {...register('password')}
                  className='form-control'
                  type='password'
                  placeholder='New Password'
                />
                {errors.password && <mark className="mt-1 mb-2 text-danger" >{errors.password.message}</mark>}
                <input
                  {...register('c_password')}
                  className='form-control'
                  type='password'
                  placeholder='Confirm Password'
                />
                {errors.c_password && <mark className="mt-1 mb-2 text-danger" >{errors.c_password.message}</mark>}
                <button type="submit" className="btn btn-light w-50">
                  Verify
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
export default ResetPassword