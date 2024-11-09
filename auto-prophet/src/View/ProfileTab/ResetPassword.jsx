import React, { Component } from "react";
import "./ResetPassword.css";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Field values
      fields: {
        email: "",
        password: "",
        confirmPassword: "",
      },
      // Validation errors
      errors: {
        email: "",
        password: "",
        confirmPassword: "",
      },
    };
  }

  resetFields = () => {
    this.setState({
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
      showPassword: false,
      showConfirmPassword: false,
    });
  };
  
  validateField = (name, value) => {
    let { errors } = this.state;
    let isValid = true;

    // Validation logic for each field
    switch (name) {
      case "email":
        if (!value) {
          isValid = false;
          errors["email"] = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          isValid = false;
          errors["email"] = "Email is invalid.";
        } else {
          errors["email"] = ""; // Clear error if valid
        }
        break;
      case "password":
        if (!value) {
          isValid = false;
          errors["password"] = "Password is required.";
        } else if (value.length < 6) {
          isValid = false;
          errors["password"] = "Password must be at least 6 characters.";
        } else {
          errors["password"] = ""; // Clear error if valid
        }
        break;
      case "confirmPassword":
        if (value !== this.state.fields.password) {
          isValid = false;
          errors["confirmPassword"] = "Passwords do not match.";
        } else {
          errors["confirmPassword"] = ""; // Clear error if valid
        }
        break;
      default:
        break;
    }

    // Update errors in the state
    this.setState({ errors });
    return isValid;
  };

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    this.setState(
      (prevState) => ({
        fields: {
          ...prevState.fields,
          [name]: fieldValue,
        },
      }),
      () => {
        this.validateField(name, fieldValue); // Validate after change
      }
    );
  };

  checkEmailExists = async (email) => {
    try {
      const response = await fetch('http://localhost:5000/api/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error("Error checking email existence:", error);
      return false;
    }
  };

  resetPassword = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert(result.message || "Password reset successful. Redirecting to login...");
        this.props.onToggleForm(); // Directly trigger form switch
      } else {
        alert(result.message || "Error during password reset.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { fields } = this.state;
    const { email, password, confirmPassword } = fields;

    let isFormValid = true;
    if (!this.validateField("email", email)) isFormValid = false;
    if (!this.validateField("password", password)) isFormValid = false;
    if (!this.validateField("confirmPassword", confirmPassword)) isFormValid = false;

    if (isFormValid) {
      this.resetFields();
      // Check if the email exists
      const emailExists = await this.checkEmailExists(email);
      if (!emailExists) {
        alert("Email does not exist. Please enter a registered email.");
        return;
      }
      // Proceed with password reset
      await this.resetPassword(email, password);
    }
  };

  handleLoginRedirect = (e) => {
    e.preventDefault();
    this.props.onToggleForm(); // Switch back to login form
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
