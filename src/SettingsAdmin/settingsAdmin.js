import React, { useState } from 'react';
import axios from 'axios';
import classNames from "classnames/bind";
import styles from './settingsAdmin.module.scss'


const cx = classNames.bind(styles)

function ChangePasswordModal({ onSubmit, onClose }) {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(password, newPassword, confirmPassword);
  };

  return (
    <div className={cx("modal")}>
      <div className={cx("modal-content")}>
        <form onSubmit={handleSubmit}>
          <h2>Change Password</h2>
          <label>Current Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div>
            <button type="submit">Change Password</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AccountSettings() {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChangePassword = (password, newPassword, confirmPassword) => {
    // Kiểm tra mật khẩu cũ có trùng với mật khẩu trong database của tài khoản hay không
    if (password === "password trong database") {
      // Kiểm tra mật khẩu mới có khớp với mật khẩu xác nhận không
      if (newPassword === confirmPassword) {
        // Cập nhật mật khẩu mới vào database của tài khoản
        // Hiển thị thông báo đổi mật khẩu thành công
        alert("Đổi mật khẩu thành công!");
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        handleCloseModal();
      } else {
        alert("Mật khẩu mới không khớp với mật khẩu xác nhận!");
      }
    } else {
      alert("Mật khẩu cũ không chính xác!");
    }
  };

  const handleChangeEmail = (newEmail) => {
    // Xử lý đổi email tương tự như đổi mật khẩu
  };
    return (
      <div>
        <h1>Account Settings</h1>
        <div>
          <h2>Change Password</h2>
          <button onClick={handleShowModal}>Change Password</button>
        </div>
        <div>
          <h2>Change Email</h2>
          <button onClick={handleShowModal}>Change Email</button>
        </div>
        {showModal && (
  <div className="popup-overlay show">
    <div className="popup show">
      <button onClick={handleCloseModal}>X</button>
      <ChangePasswordModal onSubmit={handleChangePassword} />
    </div>
  </div>
)}
  
</div>
);
  }
export default AccountSettings;