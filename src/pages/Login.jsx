import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  function DoLogin() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email,
      password: pass,
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
        }
      })
      .catch((error) => console.error(error));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-400 p-4">
      <div className="bg-gray-100 w-full max-w-lg rounded-xl shadow-lg p-8 ">
        <h2 className="text-3xl font-bold text-center mb-8">Login</h2>

        <div className="space-y-10">
          <input
            type="email"
            placeholder="Type your username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Type your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <button
            onClick={DoLogin}
            className="w-full py-2 rounded-full bg-gray-900 text-white font-semibold transition duration-300 hover:opacity-90"
          >
            LOGIN
          </button>

          <div className="text-center">
                                        <a href="#!" className="small text-muted me-2">
                                            Terms of use
                                        </a>
                                        <a href="#!" className="small text-muted">
                                            Privacy policy
                                        </a>
                                    </div>
           

           
        </div>
      </div>
    </div>
  );
}

export default Login;
