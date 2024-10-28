import React, { Component } from "react";
import "./ResetPassword.css";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      newPassword: "",
      confirmPassword: "",
      errors: {},
    };
  }

  validateField = (name, value) => {
    let errors = {};
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
        }
        break;

      case "newPassword":
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        if (!value) {
          isValid = false;
          errors["newPassword"] = "New password is required.";
        } else if (!passwordRegex.test(value)) {
          isValid = false;
          errors["newPassword"] =
            "Password must be 8-16 characters long and include at least one letter, one number, and one special character.";
        }
        break;

      case "confirmPassword":
        const { newPassword } = this.state;
        if (value !== newPassword) {
          isValid = false;
          errors["confirmPassword"] = "Passwords do not match.";
        }
        break;

      default:
        break;
    }

    if (Object.keys(errors).length > 0) {
      this.setState((prevState) => ({
        errors: { ...prevState.errors, ...errors },
      }));
    } else {
      this.setState((prevState) => {
        const newErrors = { ...prevState.errors };
        delete newErrors[name];
        return { errors: newErrors };
      });
    }

    return isValid;
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value }, () => {
      this.validateField(name, value);
    });
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

  handleSubmit = async (e) => {
  e.preventDefault();
  const { email, newPassword, confirmPassword } = this.state;

  let isFormValid = true;
  if (!this.validateField("email", email)) isFormValid = false;
  if (!this.validateField("newPassword", newPassword)) isFormValid = false;
  if (!this.validateField("confirmPassword", confirmPassword)) isFormValid = false;

  if (isFormValid) {
    // Check if the email exists
    const emailExists = await this.checkEmailExists(email);
    if (!emailExists) {
      alert("Email does not exist. Please enter a registered email.");
      return;
    }

    // Proceed with password reset
    try {
      const response = await fetch('http://localhost:5000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message); // Alert success message from server
        this.props.onToggleForm(); // Redirect to login form
      } else {
        alert(result.message); // Show error message from server
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      alert("An error occurred. Please try again later.");
    }
  }
};

  handleLoginRedirect = (e) => {
    e.preventDefault();
    this.props.onToggleForm(); // Switch back to login form
  };

  render() {
    const { errors } = this.state;

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
              <input type="email" name="email" onChange={this.handleChange} />
              {errors.email && <div className="reset-password-error">{errors.email}</div>}
            </div>
            <div className="reset-password-form-group">
              <label>
                New Password:<span className="required">*</span>
              </label>
              <input type="password" name="newPassword" onChange={this.handleChange} />
              {errors.newPassword && <div className="reset-password-error">{errors.newPassword}</div>}
            </div>
            <div className="reset-password-form-group">
              <label>
                Confirm Password:<span className="required">*</span>
              </label>
              <input type="password" name="confirmPassword" onChange={this.handleChange} />
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
