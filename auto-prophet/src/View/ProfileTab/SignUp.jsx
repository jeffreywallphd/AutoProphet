import React, { Component } from "react";
import "./SignUp.css";
import UserDTO from "./UserDTO";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      privacyChecked: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateField = (name, value) => {
    let { errors } = this.state;
    let isValid = true;
  
    const fieldValidations = {
      firstName: () => !value ? "First name is required." : value.length > 16 ? "First name must be less than 16 characters." : "",
      middleName: () => "",
      lastName: () => !value ? "Last name is required." : value.length > 16 ? "Last name must be less than 16 characters." : "",
      email: () => !value ? "Email is required." : !/\S+@\S+\.\S+/.test(value) ? "Email is invalid." : "",
      password: () => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/;
        return !value ? "Password is required." : !passwordRegex.test(value) ? "Password must be 8-16 characters with a digit, letter, and special character." : "";
      },
      confirmPassword: () => value !== this.state.fields.password ? "Passwords do not match." : "",
      privacyChecked: () => !value ? "You must agree to the privacy policy." : "",
    };
  
    const errorMsg = fieldValidations[name]();
    errors[name] = errorMsg;
    isValid = !errorMsg; // If there is an error message, it's invalid
  
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
        this.validateField(name, fieldValue);
      }
    );
  };

  handleSubmit = (e) => {
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
      fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(new UserDTO(
          fields.firstName, 
          fields.middleName, 
          fields.lastName, 
          fields.email, 
          fields.password
        )),
      }).then(response => {
        if(!response.ok){
          return response.json().then(errorData => {
            throw new Error(errorData.message || `Error: ${response.status} - ${response.statusText}`);
          });
        }
        alert("Signup successful, redirecting to Login...");
        setTimeout(() => {
          this.props.onToggleForm(); 
        }, 100);
      }).catch(error => {
        alert("Error registering user: " + error.message || "Please try again later.");
      }).finally(() => {
        this.setState((prevState) => ({
          fields: {
            ...prevState.fields,
            firstName: "",
            middleName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            privacyChecked: false,
          },
          errors: {
            ...prevState.errors,
            firstName: "",
            middleName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            privacyChecked: "",
          },
        }));
      })
    }
  };

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