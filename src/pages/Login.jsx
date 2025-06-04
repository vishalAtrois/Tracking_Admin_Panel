import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const passReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
  const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      userType: 'admin', // default selected
    },
    onSubmit: (values) => {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email: values.email,
        password: values.password,
        userType: values.userType
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      const loginUrl = values.userType === "subAdmin"
        ? "https://tracking-backend-admin.vercel.app/v1/subAdmin/loginSubAdmin"
        : "https://tracking-backend-admin.vercel.app/v1/admin/loginAdmin";

      fetch(loginUrl, requestOptions)
        .then((response) => response.json())
        .then((result) => {
              setLoading(false);
          if (result.success === true) {
            localStorage.setItem("token", result.token.access.token);
            localStorage.setItem("rtoken", result.token.refresh.token);
            localStorage.setItem("user", JSON.stringify(result.user));
            navigate("/dashboard");
            if (values.userType === "subAdmin") {
              navigate("/Subdashboard");
            } else {
              navigate("/dashboard");
            }
          } else {
            alert("Login failed: Incorrect credentials");
          }
        })
      .catch((error) => {
      console.error(error);
      setLoading(false);  
    });
    },

    validationSchema: yup.object({
      email: yup.string().required("Email is required").email("Invalid email").matches(emailReg, "email is invalid"),
      password: yup.string().required("Password is required").matches(passReg, "password is invalid"),
    })
  });

const LoaderPrompt = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-40 backdrop-blur-sm">
    <div className="flex flex-col items-center space-y-3">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-2xl text-white">Logging in...</p>
    </div>
  </div>
);




  return (
    <>
       {loading && <LoaderPrompt />}
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-400 px-2 sm:px-4">
   <div className="bg-gray-100 w-full max-w-2xl rounded-xl shadow-lg p-6 sm:p-16">
  <form onSubmit={formik.handleSubmit}>

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
          />
          {formik.errors.email && formik.touched.email && (
            <div className="text-red-500 text-sm">{formik.errors.email}</div>
          )}
        </div>

        <div className="relative">
          <label className="block mb-1">Password:</label>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Type your password"
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
          <div
            className="absolute top-10 right-3 text-gray-600 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
          {formik.errors.password && formik.touched.password && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Login as:</label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="userType"
                value="admin"
                checked={formik.values.userType === "admin"}
                onChange={formik.handleChange}
                className="mr-2"
              />
              Admin
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="userType"
                value="subAdmin"
                checked={formik.values.userType === "subAdmin"}
                onChange={formik.handleChange}
                className="mr-2"
              />
              subadmin
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 rounded-full bg-gray-900 text-white font-semibold transition duration-300 hover:opacity-90"
        
       >
          
          LOGIN
        </button>

   {formik.values.userType === "subAdmin" && (
  <div className="text-center mt-4">
    <span className="text-gray-600">Don't have an account? </span>
    <a href="/register" className="text-purple-600 font-medium hover:underline">
      Create one
    </a>
  </div>
)}

        <div className="text-center">
          <a href="#!" className="small text-muted me-2">Terms of use</a>
          <a href="#!" className="small text-muted">Privacy policy</a>
        </div>
      </div>
  </form>
    </div>
</div>
</>

  );
}

export default Login;
