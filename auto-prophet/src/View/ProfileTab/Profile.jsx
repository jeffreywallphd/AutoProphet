import React, { Component } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import ProfilePage from "./ProfilePage";
import "./Profile.css";

class Profile extends Component {
    
    constructor(props) {
        super(props);
        const savedUser = localStorage.getItem('user');
        this.state = {
            isLogin: true,
            isOverlayVisible: true,
            isResetPassword: false,
            // Retrieve user from localStorage if available
            user: savedUser ? JSON.parse(savedUser) : null,
        };
    }


    toggleForm = () => {
        this.setState((prevState) => ({
            isLogin: !prevState.isLogin,
            isResetPassword: false,
        }));
    };

    showResetPassword = () => {
        if (this.state.isLogin) {
            this.setState({
                isLogin: false,
                isResetPassword: true,
            });
        }
    };

    closeOverlay = () => {
        this.setState({
            isLogin: true,
            isOverlayVisible: false,
            isResetPassword: false,
        });
    };

    onLoginSuccess = (userData) => {
        this.setState({
            user: userData,
            isOverlayVisible: false,
        });
        // Save the user data to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
    };

    handleLogout = async () => {
        const { user } = this.state;

        if (user) {
            try {
                const response = await fetch('http://localhost:5000/api/logout', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: user.id }),
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || 'Logout failed');
                }

                // Clear user data from localStorage upon logout
                localStorage.removeItem('user');

                this.setState({
                    user: null,
                    isOverlayVisible: true,
                    isLogin: true,
                });
                alert(result.message);
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
                    <ProfilePage user={user} onLogout={this.handleLogout} />
                ) : (
                    isOverlayVisible && (
                        <div className="overlay-background visible">
                            <div className="overlay">
                                <button className="close-button" onClick={this.closeOverlay}>
                                    &times;
                                </button>
                                {isResetPassword ? (
                                    <ResetPassword onToggleForm={this.toggleForm} />
                                ) : isLogin ? (
                                    <Login
                                        onToggleForm={this.toggleForm}
                                        onResetPassword={this.showResetPassword}
                                        onLoginSuccess={this.onLoginSuccess}
                                        closeOverlay={this.closeOverlay}
                                    />
                                ) : (
                                    <SignUp 
                                        onToggleForm={this.toggleForm}
                                    />
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