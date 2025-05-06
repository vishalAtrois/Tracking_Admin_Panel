import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const passreg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
  const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email: values.email,
        password: values.password,
        userType: "admin"
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch("https://tracking-backend-admin.vercel.app/v1/admin/loginAdmin", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.success === true) {
            localStorage.setItem("token", result.token.access.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            navigate("/dashboard");
          } else {
            alert("Login failed");
          }
        })
        .catch((error) => console.error(error));
    },

    validationSchema: yup.object({
      email: yup.string().required("Email is required").email("Invalid email").matches(emailReg, "email is invalid"),
      password: yup.string().required("Password is required").matches(passreg, 'password is invalid'),
    })
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-400 p-4">
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-gray-100 w-128 max-w-lg rounded-xl shadow-lg p-16 ">
          <h2 className="text-3xl font-bold text-center mb-8">Login</h2>

          <div className="space-y-6">
            <div>
              <label className="block">Email:</label>
              <input
                name="email"
                placeholder="Type your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.email && formik.touched.email && (
                <div className="text-red-500 text-sm">{formik.errors.email}</div>
              )}
            </div>

            <div>
              <label className="block">Password:</label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Type your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
               <div
        className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-600"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </div>
              {formik.errors.password && formik.touched.password && (
                <div className="text-red-500 text-sm">{formik.errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-full bg-gray-900 text-white font-semibold transition duration-300 hover:opacity-90"
            >
              LOGIN
            </button>

            <div className="text-center">
              <a href="#!" className="small text-muted me-2">Terms of use</a>
              <a href="#!" className="small text-muted">Privacy policy</a>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
