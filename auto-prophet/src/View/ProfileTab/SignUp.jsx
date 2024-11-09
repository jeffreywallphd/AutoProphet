// SignUp.js
import React, { Component } from "react";
import "./SignUp.css";
import UserDTO from "./UserDTO";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Field values
      fields: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        privacyChecked: false,
      },
      // Validation errors
      errors: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        privacyChecked: "",
      },
      privacyChecked: false,
      showPassword: false,
      showConfirmPassword: false,
    };
  }

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
      showPassword: false,
      showConfirmPassword: false,
    });
  };

  validateField = (name, value) => {
    let { errors } = this.state;
    let isValid = true;

    // Validation logic for each field
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
        errors["middleName"] = ""; // Clear error for middle name
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

  handleSubmit = async (e) => {
    e.preventDefault();
    const { fields } = this.state;
    const { firstName, lastName, email, password, confirmPassword, privacyChecked } = fields;

    let isFormValid = true;

    if (!this.validateField("firstName", firstName)) isFormValid = false;
    if (!this.validateField("lastName", lastName)) isFormValid = false;
    if (!this.validateField("email", email)) isFormValid = false;
    if (!this.validateField("password", password)) isFormValid = false;
    if (!this.validateField("confirmPassword", confirmPassword)) isFormValid = false;
    if (!this.validateField("privacyChecked", privacyChecked)) isFormValid = false;

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
  render() {
    const { errors, fields } = this.state;

    return (
      <div class="signup">
        <h2>Create an Account</h2>
        <p>Join us and start your journey!</p>
        <form onSubmit={this.handleSubmit}>
          <div class="form-grid">
            <div class="form-group">
              <label>First Name:<span class="required">*</span></label>
              <input
                type="text"
                name="firstName"
                value={fields.firstName}
                onChange={this.handleChange}
              />
              <div class="error">{errors.firstName}</div>
            </div>
            <div class="form-group">
              <label>Middle Name:</label>
              <input
                type="text"
                name="middleName"
                value={fields.middleName}
                onChange={this.handleChange}
              />
            </div>
            <div class="form-group">
              <label>
                Last Name:<span class="required">*</span>
              </label>
              <input 
                type="text" 
                name="lastName"
                value={fields.lastName}
                onChange={this.handleChange} />
              <div class="error">{errors.lastName}</div>
            </div>
            <div class="form-group">
              <label>
                Email:<span class="required">*</span>
              </label>
              <input 
                type="email" 
                name="email"
                value={fields.email}
                onChange={this.handleChange} />
              <div class="error">{errors.email}</div>
            </div>
            <div class="form-group">
              <label>
                Password:<span class="required">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={fields.password}
                onChange={this.handleChange}
              />
              <div class="error">{errors.password}</div>
            </div>
            <div class="form-group">
              <label>
                Confirm Password:<span class="required">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={fields.confirmPassword}
                onChange={this.handleChange}
              />
              <div class="error"> {errors.confirmPassword}</div>
            </div>
          </div>
          <div class="checkbox-container">
            <div class="checkbox-row">
              <input
                type="checkbox"
                name="privacyChecked"
                checked={fields.privacyChecked}
                onChange={this.handleChange}
              />
              <label>
                I agree to the{" "}
                <a href="https://docs.google.com/document/d/1rKikrpb_zjOqbs4rEt83A5pI_7DMgKPkPn-sSXscNmI" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
                <span class="required">*</span>&nbsp;
              </label>
              <div class="error">{errors.privacyChecked}</div>
            </div>
          </div>
          <div class="login-link">
            Already have an account?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); this.props.onToggleForm(); }}>
              Login
            </a>
          </div>
          <div class="button-container">
            <button type="submit">Sign Up</button>
          </div>
        </form>
      </div>
    );
  }
}

export default SignUp;