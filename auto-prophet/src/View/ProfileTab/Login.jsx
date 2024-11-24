import React, { Component } from "react";
import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: { email: "", password: "" },
      errors: { email: "", password: "" },
      formKey: 0,
    };
  }

  validateField = (name, value) => {
    const errors = { ...this.state.errors };
    const validations = {
      email: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessage: "Email is required and should be in a valid format."
      },
      password: {
        regex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
        errorMessage: "Password should be 8-16 characters with a digit, letter, and special character."
      }
    };

    if (!value) {
      errors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
    } else if (!validations[name].regex.test(value)) {
      errors[name] = validations[name].errorMessage;
    } else {
      errors[name] = "";
    }

    this.setState({ errors });
    return !errors[name];
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(
      prevState => ({
        fields: { ...prevState.fields, [name]: value },
      }),
      () => this.validateField(name, value)
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state.fields;

    const isEmailValid = this.validateField("email", email);
    const isPasswordValid = this.validateField("password", password);

    if (isEmailValid && isPasswordValid) {
      fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((result) => {
              throw new Error(result.message || "Login failed");
            });
          }
          return response.json();
        })
        .then((result) => {
          alert("Login successful! Welcome to Auto Prophet");
          this.props.onLoginSuccess(result.user);

          setTimeout(() => this.props.closeOverlay(), 100);
        })
        .catch((error) => {
          alert(`Error: ${error.message}`);
        }).finally(() => {
          this.setState((prevState) => ({
            fields: {
              ...prevState.fields,
              email: "",
              password: ""
            },
            errors: {
              ...prevState.errors,
              email: "",
              password: ""
            },
          }));
        })
    }
  };

  render() {
    const { errors, fields } = this.state;

    return (
      <div className="login-form">
        <h2>Login</h2>
        <p>Please enter your credentials to log in.</p>
        <form onSubmit={this.handleSubmit}>
          <div className="login-form-grid">
            <div className="login-form-group">
              <label>Email:<span className="required">*</span></label>
              <input 
                type="email" 
                name="email" 
                value={fields.email}
                onChange={this.handleChange} 
              />
              {errors.email && <div className="login-error">{errors.email}</div>}
            </div>
            <div className="login-form-group">
              <label>Password:<span className="required">*</span></label>
              <input 
                type="password" 
                name="password" 
                value={fields.password}
                onChange={this.handleChange} 
              />
              {errors.password && <div className="login-error">{errors.password}</div>}
            </div>
          </div>
          <div className="forgot-password-link">
            <a href="#" onClick={(e) => { e.preventDefault(); this.props.onResetPassword(); }}>
              Forgot Password? Click here to reset password
            </a>
          </div>
          <div className="login-button-container">
            <button type="submit">Login</button>
          </div>
          <div className="login-signup-link">
            Don't have an account?&nbsp; 
            <a href="#" onClick={(e) => { e.preventDefault(); this.props.onToggleForm(); }}>
              Sign Up
            </a>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;