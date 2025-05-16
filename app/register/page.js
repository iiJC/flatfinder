"use client";
import React, { useState } from "react";
import "../css/register.scss";
import "../css/globals.scss";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  

  const [modalMessage, setModalMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (message) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setModalMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending:", formData); // ✅ Check this in browser console


    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      showModal("User registered successfully!");
    } else {
      showModal("Failed to register user.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="title">Create an Account</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input name="username" type="text" placeholder="Enter your username" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input name="name" type="text" placeholder="Enter your full name" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="Enter your email" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="Enter your password" onChange={handleChange} />
          </div>

          <button type="submit" className="register-button">
            Register
          </button>
        </form>

        <p className="register-footer">
          Already have an account?{" "}
          <a href="/login" className="login-link">
            Login
          </a>
        </p>
      </div>
      {isModalVisible && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <p>{modalMessage}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
