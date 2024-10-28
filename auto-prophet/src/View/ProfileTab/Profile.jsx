import React, { Component } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import ResetPassword from "./ResetPassword"; 
import "./Profile.css";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: true, 
            isOverlayVisible: true,
            isResetPassword: false,
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
                isResetPassword: true,
            });
        }
    };

    closeOverlay = () => {
        this.setState({ isOverlayVisible: false });
    };

    render() {
        return (
            <div>
                {this.state.isOverlayVisible && (
                    <div className="overlay-background">
                        <div className="overlay">
                            <button className="close-button" onClick={this.closeOverlay}>
                                &times;
                            </button>
                            {this.state.isResetPassword ? (
                                <ResetPassword onToggleForm={this.toggleForm} />
                            ) : this.state.isLogin ? (
                                <Login 
                                    onToggleForm={this.toggleForm} 
                                    onResetPassword={this.showResetPassword}
                                />
                            ) : (
                                <SignUp 
                                    onToggleForm={this.toggleForm} 
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Profile;
