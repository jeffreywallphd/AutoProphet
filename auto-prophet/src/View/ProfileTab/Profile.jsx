// Profile.js
import React, { Component } from "react";
import SignUp from "./SignUp";
import Login from "./Login";
import "./Profile.css";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin: false, 
            isOverlayVisible: true,
        };
    }

    toggleForm = () => {
        this.setState((prevState) => ({
            isLogin: !prevState.isLogin,
        }));
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
                            {this.state.isLogin ? (
                                <Login onToggleForm={this.toggleForm} />
                            ) : (
                                <SignUp onToggleForm={this.toggleForm} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Profile;