import { z } from "zod";

export const SignUpSchema = z
  .object({
    firstname: z.string().min(3, {
      message: "First name must required.",
    }),
    lastname: z.string().min(3, {
      message: "Last name must required.",
    }),
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(20, {
        message: "Password must be max 20 characters long.",
      }),
    //   .regex(
    //     /^(?=.[a-z])(?=.[A-Z])(?=.\d)[A-Za-z\d@$!%?&]{8,20}$/,
    //     "Password must include one small letter, one uppercase letter, and one number."
    //   ),
      c_password: z.string(),
  })
  .refine((data) => data.password === data.c_password, {
    path: ["c_password"],
    message: "Passwords don't match.",
  });

  export const LoginSchema = z.object({
    emailOrUsername: z
      .string()
      .min(1, { message: "This field is required." })
      .refine(
        (value) => {
          const isEmail = z.string().email().safeParse(value).success;
          const isUsername = /^[a-zA-Z0-9_]{3,20}$/.test(value); // Adjust the username regex according to your requirements
          return isEmail || isUsername;
        },
        {
          message: "Must be a valid email address or a username (3-20 alphanumeric characters).",
        }
      ),
    passwords: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
  });


  export const VerifySchema = z.object({
    otp: z
      .string()
      .length(6, { message: "OTP must be exactly 6 digits." })
      .regex(/^\d+$/, { message: "OTP must be a numeric value." }),
  });


  export const ResetMailSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
  })

  export const ResetPasswordSchema = z.object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(20, {
        message: "Password must be max 20 characters long.",
      })
      .regex(
        /^(?=.[a-z])(?=.[A-Z])(?=.\d)[A-Za-z\d@$!%?&]{8,20}$/,
        "Password must include one small letter, one uppercase letter, and one number."
      ),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });