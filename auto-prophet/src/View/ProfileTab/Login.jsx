// Login.js
import React, { Component } from "react";

class Login extends Component {
    render() {
        return (
            <div>
                <h2>Login Page</h2>
                <p>Please enter your credentials to log in.</p>
                <div className="button-container">
                    <button type="button" onClick={this.props.onToggleForm}>
                        Sign Up
                    </button>
                </div>
            </div>
        );
    }
}

export default Login;