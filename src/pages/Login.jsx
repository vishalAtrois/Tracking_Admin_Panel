import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBVj-2JfKUr58-EB-eDeuMnnDfIbbnjqj8",
  authDomain: "admin-panel-daebe.firebaseapp.com",
  databaseURL: "https://admin-panel-daebe-default-rtdb.firebaseio.com",
  projectId: "admin-panel-daebe",
  storageBucket: "admin-panel-daebe.firebasestorage.app",
  messagingSenderId: "899782782782",
  appId: "1:899782782782:web:58afdf532d5c025088466f",
  measurementId: "G-HP29B7D93B"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [FCMToken, setFCMToken] = useState(null);

  const passReg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
  const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  useEffect(() => {
    requestForToken();
  }, []);

  async function requestForToken() {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const swRegistration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        const token = await getToken(messaging, {
          vapidKey: "BL02NyFutH7fpsESzqtIv3KDP7UZftEM3mOwSu1s54Tc_cXmFT9RttEuAZ-VoF8v4a01EhZME8bRP5J-9HPLCDM",
          serviceWorkerRegistration: swRegistration,
        });

        if (token) {
          setFCMToken(token);
          return token;
        } else {
          console.warn("⚠️ No token available.");
          return null;
        }
      } else {
        console.warn("🔕 Notification permission not granted");
        return null;
      }
    } catch (err) {
      console.error("🔥 Error getting FCM token:", err);
      return null;
    }
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      userType: "admin",
    },
    validationSchema: yup.object({
      email: yup.string().required("Email is required").email("Invalid email").matches(emailReg, "Email is invalid"),
      password: yup.string().required("Password is required").matches(passReg, "Password is invalid"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      
  const loginData = {
    email: values.email,
    password: values.password,
    userType: values.userType,
   
  };

  // if (values.userType === 'subAdmin') {
  //   loginData.fcmToken = token;
  // }

  const body = JSON.stringify(loginData);
      const loginUrl =
        values.userType === "subAdmin"
          ? "https://tracking-backend-admin.vercel.app/v1/subAdmin/loginSubAdmin"
          : "https://tracking-backend-admin.vercel.app/v1/admin/loginAdmin";

      try {
        const response = await fetch(loginUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        });

        const result = await response.json();
        setLoading(false);

        if (result.success === true) {
          const tokenKey = values.userType === "subAdmin" ? "token" : "Admintoken";
          localStorage.setItem(tokenKey, result.token.access.token);
          localStorage.setItem("rtoken", result.token.refresh.token);
          localStorage.setItem("user", JSON.stringify(result.user));
          if (values.userType === "subAdmin") {
            navigate("/Subdashboard");
          } else {
            navigate("/dashboard");
          }
        } else {
          alert("Login failed: Incorrect credentials");
        }
      } catch (err) {
        console.error("Login error:", err);
        alert("Something went wrong. Please try again.");
        setLoading(false);
      }
    },
  });

  const LoaderPrompt = () => (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-gray-900 bg-opacity-40 backdrop-blur-sm">
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
                className="w-full py-2 rounded-full bg-gray-900 text-white font-semibold transition duration-300 hover:opacity-90 disabled:opacity-50"
              >
                LOGIN
              </button>

              {formik.values.userType === "subAdmin" && (
                <div className="text-center mt-4">
                  <span className="text-gray-600">Don't have an account? </span>
                  <a href="/register" className="text-purple-600 font-medium hover:underline">
                    Create one
                  </a>
                  <div className="mt-2">
                    <a href="/SubForgotPassword" className="text-blue-600 font-medium hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                </div>
              )}

              <div className="text-center">
                <a href="#!" className="small text-muted me-2">
                  Terms of use
                </a>
                <a href="#!" className="small text-muted">
                  Privacy policy
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
