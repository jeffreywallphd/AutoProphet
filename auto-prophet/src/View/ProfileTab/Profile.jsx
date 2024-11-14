import React, { Component } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import ProfilePage from "./ProfilePage";
import "./Profile.css";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: true,             // Controls display between Login and SignUp components
            isOverlayVisible: true,     // Controls the visibility of the overlay
            isResetPassword: false,     // Toggles Reset Password view
            user: null,                 // Stores user data after successful login
        };
    }

    // Toggles between Login and SignUp forms, and hides Reset Password form if open
    toggleForm = () => {
        this.setState((prevState) => ({
            isLogin: !prevState.isLogin,
            isResetPassword: false,
        }));
    };

    // Shows Reset Password form if currently in Login view
    showResetPassword = () => {
        if (this.state.isLogin) {
            this.setState({
                isLogin: false,
                isResetPassword: true,
            });
        }
    };

    // Closes the overlay and resets to Login form
    closeOverlay = () => {
        this.setState({
            isLogin: true,
            isOverlayVisible: false,
            isResetPassword: false,
        });
    };

    // Updates state with user data upon successful login and hides overlay
    onLoginSuccess = (userData) => {
        this.setState({
            user: userData,
            isOverlayVisible: false,
        });
    };

    // Handles user logout, sending a request to the server and updating the state
    handleLogout = async () => {
        const { user } = this.state;

        if (user) {
            try {
                const response = await fetch('http://localhost:5000/api/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.id }),
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || 'Logout failed');
                }

                // Clear user data and reset to Login view
                this.setState({
                    user: null,
                    isOverlayVisible: true,
                    isLogin: true,
                });
                alert(result.message); // Display logout success message
            } catch (error) {
                console.error('Logout Error:', error);
                alert('Error logging out');
            }
        }
    };

    render() {
        const { isOverlayVisible, isLogin, isResetPassword, user } = this.state;

        return (
            <div>
                {user ? (
                    // Display ProfilePage if user is logged in
                    <ProfilePage user={user} onLogout={this.handleLogout} />
                ) : (
                    // Show overlay with form selection if no user is logged in
                    isOverlayVisible && (
                        <div className="overlay-background visible">
                            <div className="overlay">
                                <button className="close-button" onClick={this.closeOverlay}>
                                    &times;
                                </button>
                                {isResetPassword ? (
                                    // Display Reset Password form
                                    <ResetPassword onToggleForm={this.toggleForm} />
                                ) : isLogin ? (
                                    // Display Login form
                                    <Login
                                        onToggleForm={this.toggleForm}
                                        onResetPassword={this.showResetPassword}
                                        onLoginSuccess={this.onLoginSuccess}
                                    />
                                ) : (
                                    // Display SignUp form
                                    <SignUp onToggleForm={this.toggleForm} />
                                )}
                            </div>
                        </div>
                    )
                )}
            </div>
        );
    }
}

export default Profile;