import React, { useState } from "react"
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')


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

        fetch("http://16.171.60.57:3001/v1/admin/loginAdmin", requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (result.success == true) {
                    console.warn(result);
                    localStorage.setItem('token', result.token.access.token)
                    localStorage.setItem('user', JSON.stringify(result.user))
                    navigate('/dashboard')
                }
            })
            .catch((error) => console.error(error));
    }
    return (
        <section className="vh-100" style={{ backgroundColor: "#9A616D" }}>
            <div className="container h-100">
                <div className="row justify-content-center align-items-center h-100">
                    <div className="col-md-8 col-lg-6 col-xl-5">
                        <div className="card" style={{ borderRadius: "1rem" }}>
                            <div className="card-body p-4 p-md-5 text-black w-100">
                                <form>
                                    <h5
                                        className="h1 fw-bold mb-3 pb-1 text-center"
                                        style={{ letterSpacing: 1, color: "black" }}
                                    >
                                        Sign into your account
                                    </h5>


                                    <div className="form-outline mb-3">
                                        <input
                                            type="email"
                                            name="email-login"
                                            autoComplete="off"
                                            className="form-control form-control-lg"
                                            placeholder="Enter Email here ...."
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-outline mb-3">
                                        <input
                                            type="password"
                                            name="new-password"
                                            autoComplete="new-password"
                                            className="form-control form-control-lg"
                                            placeholder="Enter Password here ...."
                                            value={pass}
                                            onChange={(e) => setPass(e.target.value)}
                                        />
                                    </div>

                                    <div className="pt-1 mb-4">
                                        <button
                                            className="btn btn-dark btn-lg btn-block w-100"
                                            type="button"
                                            onClick={DoLogin}
                                        >
                                            Login
                                        </button>
                                    </div>

                                    <div className="text-center">
                                        <a href="#!" className="small text-muted me-2">
                                            Terms of use
                                        </a>
                                        <a href="#!" className="small text-muted">
                                            Privacy policy
                                        </a>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


    )
}

export default Login







