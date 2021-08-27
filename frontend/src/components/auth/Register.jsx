import { useState, useEffect } from "react";
import { useHistory, Redirect, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../axios";
import requests from "../../requests";
import Button from "../base/Button";
import styles from "./auth.module.css";

const Register = () => {
  const [register, setRegister] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [classes, setClasses] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [passwordError, setPasswordError] = useState();
  const history = useHistory();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    handlePasswordMatch();
  });

  const handleRegister = (e) => {
    setRegister({ ...register, [e.target.name]: e.target.value });
    if ((e.target.name === "password1") | (e.target.name === "password2")) {
      setClasses({
        ...classes,
        password: "",
      });
    } else {
      setClasses({
        ...classes,
        [e.target.name]: "",
      });
    }
  };

  const handlePasswordMatch = () => {
    if (register.password2) {
      if (register.password2 !== register.password1) {
        setPasswordError("passwords not matched");
      } else {
        setPasswordError("");
      }
    } else {
      setPasswordError("");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let username = register.username,
      email = register.email,
      password1 = register.password1,
      password2 = register.password2;

    if (password1 === password2) {
      let password = password2;
      try {
        setRegisterLoading(true);
        await axios.post(requests.registerURL, {
          username: username,
          email: email,
          password: password,
        });
        setClasses({
          username: "is-valid",
          email: "is-valid",
          password: "is-valid",
        });
        history.push("/login/");
      } catch (err) {
        let errorData = err.response.data;
        setErrors(errorData);
        errorData.username &&
          setClasses({
            ...classes,
            username: "is-invalid",
          });
        errorData.email &&
          setClasses({
            ...classes,
            email: "is-invalid",
          });
        errorData.password &&
          setClasses({
            ...classes,
            password: "is-invalid",
          });
      } finally {
        setRegisterLoading(false);
      }
    } else {
      return;
    }
  };

  if (auth.isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <div className={styles.authPageWrapper}>
      <div className={`${styles.authPage} p-5`}>
        <div className="container">
          <div className="sign-in-wrapper">
            <div className="header mb-4 text-center">
              <h4>Register an Account</h4>
            </div>
            <div className="form-wrapper">
              <form
                method="POST"
                className="row g-3"
                onSubmit={handleFormSubmit}
              >
                <div className="col-md-6">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    onChange={handleRegister}
                    name="username"
                    type="username"
                    className={`form-control ${classes.username}`}
                    id="username"
                    placeholder="Username"
                    required
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    onChange={handleRegister}
                    name="email"
                    type="email"
                    className={`form-control ${classes.email}`}
                    id="email"
                    placeholder="Email"
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="col-md-12">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    onChange={handleRegister}
                    name="password1"
                    type="password"
                    className={`form-control ${classes.password}`}
                    id="password1"
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="password2" className="form-label">
                    Repeat password
                  </label>
                  <input
                    onChange={handleRegister}
                    name="password2"
                    type="password"
                    aria-describedby=""
                    className={`form-control ${classes.password}`}
                    id="password2"
                    placeholder="Repeat password"
                    required
                  />
                  {passwordError && (
                    <div className="text-danger mt-2">{passwordError}</div>
                  )}
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="col-12">
                  <Button
                    className="primary"
                    text="Register"
                    textLoading="Registering"
                    loading={registerLoading}
                  />
                </div>
                <div>
                  <small>
                    Allready have an active account?{" "}
                    <Link to="/login/">Login Here</Link>
                  </small>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
