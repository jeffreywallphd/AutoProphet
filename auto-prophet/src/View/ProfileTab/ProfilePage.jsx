import React from "react";
import "./ProfilePage.css";

const ProfilePage = ({ user, onLogout }) => {
    // Destructure necessary user fields for easy access
    const { firstName, middleName, lastName, email, lastLoggedIn, isLoggedIn, isValid, created_at } = user;

    return (
        <div className="profile-page">
            {/* Logout button triggers onLogout function */}
            <button className="logout-button" onClick={onLogout}>
                Logout
            </button>
            <h2>Profile Details</h2>
            <div className="profile-info">
                {/* Display first name */}
                <div className="profile-item">
                    <span className="profile-label">First Name:</span>
                    <span className="profile-value">{firstName}</span>
                </div>
                
                {/* Conditionally display middle name if available */}
                {middleName && (
                    <div className="profile-item">
                        <span className="profile-label">Middle Name:</span>
                        <span className="profile-value">{middleName}</span>
                    </div>
                )}
                
                {/* Display last name */}
                <div className="profile-item">
                    <span className="profile-label">Last Name:</span>
                    <span className="profile-value">{lastName}</span>
                </div>
                
                {/* Display email address */}
                <div className="profile-item">
                    <span className="profile-label">Email:</span>
                    <span className="profile-value">{email}</span>
                </div>
                
                {/* Display last login date, formatted */}
                <div className="profile-item">
                    <span className="profile-label">Last Logged In:</span>
                    <span className="profile-value">{lastLoggedIn ? new Date(lastLoggedIn).toLocaleString() : "Never"}</span>
                </div>
                
                {/* Display account creation date, formatted */}
                <div className="profile-item">
                    <span className="profile-label">Account Created:</span>
                    <span className="profile-value">{new Date(created_at).toLocaleString()}</span>
                </div>
                
                {/* Display login status */}
                <div className="profile-item">
                    <span className="profile-label">Login Status:</span>
                    <span className="profile-value">{isLoggedIn ? "Online" : "Offline"}</span>
                </div>
                
                {/* Display account validity */}
                <div className="profile-item">
                    <span className="profile-label">Account Valid:</span>
                    <span className="profile-value">{isValid ? "Yes" : "No"}</span>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;