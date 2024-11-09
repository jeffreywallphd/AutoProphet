// Login.js
import React, { Component } from "react";
import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        fields: {
          email: "",
          password: "",
        },
        errors: {
          email: "",
          password: "",
        },
      isLoggedIn: false,
    };
  }

  resetFields = () => {
    this.setState({
      fields: {
        email: "",
        password: "",
      },
      errors: {
        email: "",
        password: "",
      },
    });
  };


  validateField = (name, value) => {
    let { errors } = this.state;
    let isValid = true;

    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          isValid = false;
          errors["email"] = "Email is required.";
        } else if (!emailRegex.test(value)) {
          isValid = false;
          errors["email"] = "Invalid email format.";
        } else {
          errors["email"] = "";   
        }
        break;

        case "password":
          const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
          if (!value) {
            isValid = false;
            errors["password"] = "Password is required.";
          } else if (!passwordRegex.test(value)) {
            isValid = false;
            errors["password"] =
              "8-16 length with a digit, a letter and a special character.";
          } else {
            errors["password"] = ""; 
          }
          
          break;

      default:
        break;
    }

    this.setState({ errors });
    return isValid;
  };

  handleChange = (e) => {
    const { name, value } = e.target;

    this.setState(
      (prevState) => ({
        fields: {
          ...prevState.fields,
          [name]: value,
        },
      }),
      () => {
        this.validateField(name, value); 
      }
    );
  };

  checkCredentials = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }
      return result; 
    } catch (error) {
      alert(error.message);
      return null;
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { fields } = this.state;
    const { email, password } = fields;

    let isFormValid = true;
    if (!this.validateField("email", email)) isFormValid = false;
    if (!this.validateField("password", password)) isFormValid = false;

    this.resetFields();

    if (isFormValid) {
      const result = await this.checkCredentials(email, password);
      if (result) {
        alert("Login successful! Welcome to Auto Prophet");
        this.props.onLoginSuccess(result.user);
        setTimeout(() => {
          this.props.closeOverlay();
        }, 100);
    }
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
              <label>
                Email:<span className="required">*</span>
              </label>
              <input 
                type="email" 
                name="email" 
                value={fields.email}
                onChange={this.handleChange} 
              />
              {errors.email && <div className="login-error">{errors.email}</div>}
            </div>
            <div className="login-form-group">
              <label>
                Password:<span className="required">*</span>
              </label>
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
};

export default Login
