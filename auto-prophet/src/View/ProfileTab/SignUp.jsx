// SignUp.js
import React, { Component } from "react";
import "./SignUp.css";
import UserDTO from "./UserDTO";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      errors: {},
      termsChecked: false,
      privacyChecked: false,
      showPassword: false,
      showConfirmPassword: false,
    };
  }

  resetForm = () => {
    this.setState({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      errors: {},
      termsChecked: false,
      privacyChecked: false,
    });
  };

  validateField = (name, value) => {
    let errors = {};
    let isValid = true;

    switch (name) {
      case "firstName":
        if (!value) {
          isValid = false;
          errors["firstName"] = "First name is required.";
        } else if (value.length > 16) {
          isValid = false;
          errors["firstName"] = "First name must be less than 16 characters.";
        }
        break;

      case "lastName":
        if (!value) {
          isValid = false;
          errors["lastName"] = "Last name is required.";
        } else if (value.length > 16) {
          isValid = false;
          errors["lastName"] = "Last name must be less than 16 characters.";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          isValid = false;
          errors["email"] = "Email is required.";
        } else if (!emailRegex.test(value)) {
          isValid = false;
          errors["email"] = "Invalid email format.";
        } else {
          const existingEmails = ["test@example.com"];
          if (existingEmails.includes(value)) {
            isValid = false;
            errors["email"] = "Email already exists.";
          }
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
        }
        break;

      case "confirmPassword":
        const { password } = this.state;
        if (value !== password) {
          isValid = false;
          errors["confirmPassword"] = "Passwords do not match.";
        }
        break;

      case "termsChecked":
      case "privacyChecked":
        if (!value) {
          isValid = false;
          errors[name] =
            `You must agree to the ${name === "termsChecked" ? "terms and conditions" : "privacy policy"}.`;
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
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    this.setState({ [name]: fieldValue }, () => {
      this.validateField(name, fieldValue);
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      confirmPassword,
      termsChecked,
      privacyChecked,
    } = this.state;

    let isFormValid = true;

    if (!this.validateField("firstName", firstName)) isFormValid = false;
    if (!this.validateField("lastName", lastName)) isFormValid = false;
    if (!this.validateField("email", email)) isFormValid = false;
    if (!this.validateField("password", password)) isFormValid = false;
    if (!this.validateField("confirmPassword", confirmPassword)) isFormValid = false;
    if (!this.validateField("termsChecked", termsChecked)) isFormValid = false;
    if (!this.validateField("privacyChecked", privacyChecked)) isFormValid = false;

    if (isFormValid) {
      const userDto = new UserDTO(firstName, middleName, lastName, email, password);
      
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
          alert(data.message);
          this.resetForm();
        }
      } catch (error) {
        console.error("There was an error registering the user!", error);
        alert("Error registering user: " + error.message || "Please try again later.");
      }
    }
  };
  render() {
    const { errors } = this.state;

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
                onChange={this.handleChange}
              />
              <div class="error">{errors.firstName}</div>
            </div>
            <div class="form-group">
              <label>Middle Name:</label>
              <input
                type="text"
                name="middleName"
                onChange={this.handleChange}
              />
            </div>
            <div class="form-group">
              <label>
                Last Name:<span class="required">*</span>
              </label>
              <input type="text" name="lastName" onChange={this.handleChange} />
              <div class="error">{errors.lastName}</div>
            </div>
            <div class="form-group">
              <label>
                Email:<span class="required">*</span>
              </label>
              <input type="email" name="email" onChange={this.handleChange} />
              <div class="error">{errors.email}</div>
            </div>
            <div class="form-group">
              <label>
                Password:<span class="required">*</span>
              </label>
              <input
                type="password"
                name="password"
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
                onChange={this.handleChange}
              />
              <div class="error"> {errors.confirmPassword}</div>
            </div>
          </div>
          <div class="checkbox-container">
            <div class="checkbox-row">
              <input
                type="checkbox"
                name="termsChecked"
                onChange={this.handleChange}
              />
              <label>
                I agree to the{" "}
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Terms and Conditions
                </a>
                <span class="required">*</span>&nbsp;
              </label>
              <div class="error"> {errors.termsChecked}</div>
            </div>
          </div>
          <div class="checkbox-container">
            <div class="checkbox-row">
              <input
                type="checkbox"
                name="privacyChecked"
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