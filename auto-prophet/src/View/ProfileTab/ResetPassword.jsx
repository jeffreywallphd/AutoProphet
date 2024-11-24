import React, { Component } from "react";
import "./ResetPassword.css";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        email: "",
        password: "",
        confirmPassword: "",
      },
      errors: {
        email: "",
        password: "",
        confirmPassword: "",
      },
    };
  }

  validateField = (name, value) => {
    let { errors } = this.state;
    let isValid = true;
  
    const validations = {
      email: {
        regex: /\S+@\S+\.\S+/,
        message: "Email is required and should be in a valid format.",
      },
      password: {
        regex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
        message: "Password should be 8-16 characters with a digit, letter, and special character.",
      },
      confirmPassword: {
        check: value === this.state.fields.password,
        message: "Passwords do not match.",
      },
    };
  
    if (!value) {
      errors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
      isValid = false;
    } else if (validations[name]?.regex && !validations[name].regex.test(value)) {
      errors[name] = validations[name].message;
      isValid = false;
    } else if (validations[name]?.check === false) {
      errors[name] = validations[name].message;
      isValid = false;
    } else {
      errors[name] = "";
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

  handleSubmit = (e) => {
    e.preventDefault();
    const { fields } = this.state;
    const { email, password, confirmPassword } = fields;
  
    let isFormValid = this.validateField("email", email) &&
                      this.validateField("password", password) &&
                      this.validateField("confirmPassword", confirmPassword);
  
    if (isFormValid) {
      fetch("http://localhost:5000/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
        .then((response) => response.json())
        .then((emailResult) => {
          if (!emailResult.exists) {
            alert("Email does not exist. Please enter a registered email.");
            return;
          }
          fetch("http://localhost:5000/api/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          })
            .then((response) => response.json())
            .then((resetResult) => {
              if (resetResult.success) {
                alert(resetResult.message || "Password reset successful. Redirecting to login...");
                this.props.onToggleForm();
              } else {
                alert(resetResult.message || "Error during password reset.");
              }
            })
            .catch((error) => {
              alert("An error occurred while resetting the password. Please try again later.");
              console.error("Error during password reset:", error);
            });
        })
        .catch((error) => {
          alert("Error checking email existence. Please try again later.");
          console.error("Error checking email existence:", error);
        })
        .finally(() => {
          this.setState((prevState) => ({
            fields: {
              ...prevState.fields,
              email: "",
              password: "",
              confirmPassword: "",
            },
          }));
        });
    }
  };

  handleLoginRedirect = (e) => {
    e.preventDefault();
    this.props.onToggleForm();
  };

  render() {
    const { errors, fields } = this.state;

    return (
      <div className="reset-password-form">
        <h2>Reset Password</h2>
        <p>Please enter your email and new password.</p>
        <form onSubmit={this.handleSubmit}>
          <div className="reset-password-form-grid">
            <div className="reset-password-form-group">
              <label>
                Email:<span className="required">*</span>
              </label>
              <input 
                type="email" 
                name="email" 
                value={fields.email}
                onChange={this.handleChange} 
              />
              {errors.email && <div className="reset-password-error">{errors.email}</div>}
            </div>
            <div className="reset-password-form-group">
              <label>
                New Password:<span className="required">*</span>
              </label>
              <input 
                type="password" 
                name="password" 
                value={fields.password}
                onChange={this.handleChange} 
              />
              {errors.password && <div className="reset-password-error">{errors.password}</div>}
            </div>
            <div className="reset-password-form-group">
              <label>
                Confirm Password:<span className="required">*</span>
              </label>
              <input 
                type="password" 
                name="confirmPassword" 
                value={fields.confirmPassword}
                onChange={this.handleChange} 
              />
              {errors.confirmPassword && <div className="reset-password-error">{errors.confirmPassword}</div>}
            </div>
          </div>
          <div className="reset-password-button-container">
            <button type="submit">Reset Password</button>
          </div>
          <div className="reset-password-login-link">
            Remembered your password? <a href="#" onClick={this.handleLoginRedirect}>Login</a>
          </div>
        </form>
      </div>
    );
  }
}

export default ResetPassword;