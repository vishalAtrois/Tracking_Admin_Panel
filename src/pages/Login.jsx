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
                    <div className="col-md-10 col-lg-8 col-xl-6">
                        <div className="card" style={{ borderRadius: "1rem" }}>
                            <div className="row g-0">
                                <div className="col-md-5 d-none d-md-block">
                                    <img
                                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                                        alt="login form"
                                        className="img-fluid h-100"
                                        style={{ borderRadius: "1rem 0 0 1rem", objectFit: "cover" }}
                                    />
                                </div>
                                <div className="col-md-7 d-flex align-items-center">
                                    <div className="card-body p-4 p-md-5 text-black w-100">
                                        <form>
                                            <div className="d-flex align-items-center mb-3 pb-1">
                                                <i
                                                    className="fas fa-cubes fa-2x me-3"
                                                    style={{ color: "#ff6219" }}
                                                />
                                                <span className="h1 fw-bold mb-0"></span>
                                            </div>

                                            <h5
                                                className="fw-normal mb-2 pb-1"
                                                style={{ letterSpacing: 1 }}
                                            >
                                                Sign into your account
                                            </h5>

                                            <div className="form-outline mb-1">
                                                <input
                                                    type="email"
                                                    name="email-login"
                                                    autoComplete="off"
                                                    className="form-control form-control-lg"
                                                    placeholder="Enter Email here ...."
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                                <label className="form-label"></label>
                                            </div>

                                            <div className="form-outline mb-1">
                                                <input
                                                    type="password"
                                                    name="new-password"
                                                    autoComplete="new-password"
                                                    className="form-control form-control-lg"
                                                    placeholder="Enter Password here ...."
                                                    value={pass}
                                                    onChange={(e) => setPass(e.target.value)}
                                                />
                                                <label className="form-label"></label>
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
                                            <a href="#!" className="small text-muted me-2">
                                                Terms of use
                                            </a>
                                            <a href="#!" className="small text-muted">
                                                Privacy policy
                                            </a>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Login








{/* <section className="vh-100" style={{ backgroundColor: "#9A616D" }}>
  <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
      <div className="col col-xl-10">
        <div className="card" style={{ borderRadius: "1rem" }}>
          <div className="row g-0">
            <div className="col-md-6 col-lg-5 d-none d-md-block">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                alt="login form"
                className="img-fluid"
                style={{ borderRadius: "1rem 0 0 1rem" }}
              />
            </div>
            <div className="col-md-6 col-lg-7 d-flex align-items-center">
              <div className="card-body p-4 p-lg-5 text-black">
                <form>
                  <div className="d-flex align-items-center mb-3 pb-1">
                    <i
                      className="fas fa-cubes fa-2x me-3"
                      style={{ color: "#ff6219" }}
                    />
                    <span className="h1 fw-bold mb-0">Logo</span>
                  </div>
                  <h5
                    className="fw-normal mb-3 pb-3"
                    style={{ letterSpacing: 1 }}
                  >
                    Sign into your account
                  </h5>
                  <div data-mdb-input-init="" className="form-outline mb-4">
                    <input
                      type="email"
                      id="form2Example17"
                      className="form-control form-control-lg"
                    />
                    <label className="form-label" htmlFor="form2Example17">
                      Email address
                    </label>
                  </div>
                  <div data-mdb-input-init="" className="form-outline mb-4">
                    <input
                      type="password"
                      id="form2Example27"
                      className="form-control form-control-lg"
                    />
                    <label className="form-label" htmlFor="form2Example27">
                      Password
                    </label>
                  </div>
                  <div className="pt-1 mb-4">
                    <button
                      data-mdb-button-init=""
                      data-mdb-ripple-init=""
                      className="btn btn-dark btn-lg btn-block"
                      type="button"
                    >
                      Login
                    </button>
                  </div>
                  <a className="small text-muted" href="#!">
                    Forgot password?
                  </a>
                  <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                    Don't have an account?{" "}
                    <a href="#!" style={{ color: "#393f81" }}>
                      Register here
                    </a>
                  </p>
                  <a href="#!" className="small text-muted">
                    Terms of use.
                  </a>
                  <a href="#!" className="small text-muted">
                    Privacy policy
                  </a>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section> */}
