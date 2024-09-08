import React from 'react';
import './OtpVerification.css'; // Import the CSS file
import 'bootstrap/dist/css/bootstrap.min.css';

const OtpVerification = () => {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card otp-card border-0 shadow-sm">
                <div className="card-body text-center">
                    <h1 className="mb-4 text-light">Verify Your OTP</h1>
                    <p className="text-light m-0">We have sent a verification code to your email.</p>
                    <p className="text-light mb-4">Please enter it below to verify your account.</p>
                    <form id="otp-form">
                        <div className="d-flex justify-content-center mb-4">
                            <input type="text" maxLength="1" className="form-control otp-input mx-1" autoFocus />
                            <input type="text" maxLength="1" className="form-control otp-input mx-1" />
                            <input type="text" maxLength="1" className="form-control otp-input mx-1" />
                            <input type="text" maxLength="1" className="form-control otp-input mx-1" />
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
