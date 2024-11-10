import React from "react";
import "./ProfilePage.css";

const ProfilePage = ({ user, onLogout }) => {
    const { firstName, middleName, lastName, email, lastLoggedIn, isLoggedIn, isValid, created_at } = user;

  return (
    <div className="profile-page">
      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
      <h2>Profile Details</h2>
      <div className="profile-info">
        <div className="profile-item">
          <span className="profile-label">First Name:</span>
          <span className="profile-value">{firstName}</span>
        </div>
        {middleName && (
          <div className="profile-item">
            <span className="profile-label">Middle Name:</span>
            <span className="profile-value">{middleName}</span>
          </div>
        )}
        <div className="profile-item">
          <span className="profile-label">Last Name:</span>
          <span className="profile-value">{lastName}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Email:</span>
          <span className="profile-value">{email}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Last Logged In:</span>
          <span className="profile-value">{new Date(lastLoggedIn).toLocaleString()}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Account Created:</span>
          <span className="profile-value">{new Date(created_at).toLocaleString()}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Login Status:</span>
          <span className="profile-value">{isLoggedIn ? "Online" : "Offline"}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Account Valid:</span>
          <span className="profile-value">{isValid ? "Yes" : "No"}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;