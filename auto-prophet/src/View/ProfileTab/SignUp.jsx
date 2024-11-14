// SignUp.js

import React, { Component } from "react";
import "./SignUp.css";
import UserDTO from "./UserDTO";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Initial field values for the form
      fields: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        privacyChecked: false,
      },
      // Initial validation errors for each field
      errors: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        privacyChecked: "",
      },
      privacyChecked: false, // Privacy policy checkbox initial state
    };
  }

  // Reset form fields and errors
  resetFields = () => {
    this.setState({
      fields: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        privacyChecked: false,
      },
      errors: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        privacyChecked: "",
      },
      showPassword: false, // Hide passwords initially
      showConfirmPassword: false,
    });
  };

  // Validate individual field values
  validateField = (name, value) => {
    let { errors } = this.state;
    let isValid = true;

    // Validation logic based on field name
    switch (name) {
      case "firstName":
        if (!value) {
          isValid = false;
          errors["firstName"] = "First name is required.";
        } else if (value.length > 16) {
          isValid = false;
          errors["firstName"] = "First name must be less than 16 characters.";
        } else {
          errors["firstName"] = ""; // Clear error if valid
        }
        break;
      case "middleName":
        errors["middleName"] = ""; // No validation for middle name
        break;
      case "lastName":
        if (!value) {
          isValid = false;
          errors["lastName"] = "Last name is required.";
        } else if (value.length > 16) {
          isValid = false;
          errors["lastName"] = "Last name must be less than 16 characters.";
        } else {
          errors["lastName"] = ""; // Clear error if valid
        }
        break;
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
      case "privacyChecked":
        if (!value) {
          isValid = false;
          errors["privacyChecked"] = "You must agree to the privacy policy.";
        } else {
          errors["privacyChecked"] = ""; // Clear error if valid
        }
        break;
      default:
        break;
    }

    // Update errors in the state
    this.setState({ errors });
    return isValid;
  };

  // Handle changes in form inputs
  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    // Update state with new field value and validate
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

  // Handle form submission
  handleSubmit = async (e) => {
    e.preventDefault();
    const { fields } = this.state;
    const { firstName, lastName, email, password, confirmPassword, privacyChecked } = fields;

    let isFormValid = true;

    // Validate each field before submitting
    if (!this.validateField("firstName", firstName)) isFormValid = false;
    if (!this.validateField("lastName", lastName)) isFormValid = false;
    if (!this.validateField("email", email)) isFormValid = false;
    if (!this.validateField("password", password)) isFormValid = false;
    if (!this.validateField("confirmPassword", confirmPassword)) isFormValid = false;
    if (!this.validateField("privacyChecked", privacyChecked)) isFormValid = false;

    // Submit form if valid
    if (isFormValid) {
      const userDto = new UserDTO(
        fields.firstName, 
        fields.middleName, 
        fields.lastName, 
        fields.email, 
        fields.password
      );
      this.resetFields();

      try {
        const response = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userDto),
        });

        const data = await response.json();

        if (data.message) {
          alert("Signup successful, redirecting to Login...");
          setTimeout(() => {
            this.props.onToggleForm(); 
          }, 100);
        }
      } catch (error) {
        console.error("There was an error registering the user!", error);
        alert("Error registering user: " + error.message || "Please try again later.");
      }
    }
  };

  // Render form with inputs, error messages, and links
  render() {
    const { errors, fields } = this.state;

    return (
      <div className="signup">
        <h2>Create an Account</h2>
        <p>Join us and start your journey!</p>
        <form onSubmit={this.handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name:<span className="required">*</span></label>
              <input type="text" name="firstName" value={fields.firstName} onChange={this.handleChange} />
              <div className="error">{errors.firstName}</div>
            </div>
            <div className="form-group">
              <label>Middle Name:</label>
              <input type="text" name="middleName" value={fields.middleName} onChange={this.handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name:<span className="required">*</span></label>
              <input type="text" name="lastName" value={fields.lastName} onChange={this.handleChange} />
              <div className="error">{errors.lastName}</div>
            </div>
            <div className="form-group">
              <label>Email:<span className="required">*</span></label>
              <input type="email" name="email" value={fields.email} onChange={this.handleChange} />
              <div className="error">{errors.email}</div>
            </div>
            <div className="form-group">
              <label>Password:<span className="required">*</span></label>
              <input type="password" name="password" value={fields.password} onChange={this.handleChange} />
              <div className="error">{errors.password}</div>
            </div>
            <div className="form-group">
              <label>Confirm Password:<span className="required">*</span></label>
              <input type="password" name="confirmPassword" value={fields.confirmPassword} onChange={this.handleChange} />
              <div className="error">{errors.confirmPassword}</div>
            </div>
          </div>
          <div className="checkbox-container">
            <div className="checkbox-row">
              <input type="checkbox" name="privacyChecked" checked={fields.privacyChecked} onChange={this.handleChange} />
              <label>
                I agree to the{" "}
                <a href="https://docs.google.com/document/d/1rKikrpb_zjOqbs4rEt83A5pI_7DMgKPkPn-sSXscNmI" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
                <span className="required">*</span>&nbsp;
              </label>
              <div className="error">{errors.privacyChecked}</div>
            </div>
          </div>
          <div className="login-link">
            Already have an account?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); this.props.onToggleForm(); }}>
              Login
            </a>
          </div>
          <button type="submit">Create Account</button>
        </form>
      </div>
    );
  }
}

export default SignUp;