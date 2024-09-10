import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import './OtpVerification.css'; // Import the CSS file
import 'bootstrap/dist/css/bootstrap.min.css';

const OtpVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '']); // State to hold OTP values
    const userid = localStorage.getItem("user_id");
    // Function to handle OTP input change
    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (/^\d$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to next input field when the current one is filled
            if (value && index < otp.length - 1) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        }
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        console.log(otpString);
        try {
            const response = await axios.post('http://127.0.0.1:8000/verify/', // Replace with your actual endpoint
                { otp: otpString ,user_id:userid},
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            // Handle successful verification
            console.log('OTP verified:', response.data);
        } catch (error) {
            // Handle errors
            if (error.response) {
                console.error('Error:', error.response.data.error);
            } else {
                console.error('Error:', error.message);
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card otp-card border-0 shadow-sm">
                <div className="card-body text-center">
                    <h1 className="mb-4 text-light">Verify Your OTP</h1>
                    <p className="text-light m-0">We have sent a verification code to your email.</p>
                    <p className="text-light mb-4">Please enter it below to verify your account.</p>
                    <form id="otp-form" onSubmit={handleSubmit}>
                        <div className="d-flex justify-content-center mb-4">
                            {otp.map((value, index) => (
                                <input
                                    key={index}
                                    id={`otp-input-${index}`}
                                    type="text"
                                    maxLength="1"
                                    className="form-control otp-input mx-1"
                                    value={value}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>
                        <button type="submit" className="btn btn-light w-100">Verify</button>
                    </form>
                    <p className="mt-3 text-light">
                        Didn't receive the code? <a href="#" className="text-light">Resend</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;
