import classNames from 'classnames/bind';
import styles from './changPassword.module.scss'
import { FaAngleDoubleRight, FaAngleDoubleLeft, FaArrowRight, FaLocationArrow, FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";


const cx = classNames.bind(styles)
function ChangePassword() {
    const [newpassword, setNewPassword] = useState("");
    const [confpassword, setConfirmNewPassword] = useState("");

    const jobpost_token = localStorage.getItem('user-save');
    const decodeEmail = jwt_decode(jobpost_token);
    const email = decodeEmail.email;

    const handleClose = () => {
      
    };
  
  const handleSubmit = (event) => {
  event.preventDefault();
  if (newpassword !== confpassword) {
    alert("Mật khẩu mới và xác nhận mật khẩu mới không khớp");
    return;
  }

  const request = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      newpassword,
      confpassword,
    }),
  };

  fetch("http://localhost:5000/auth/reset-password", request)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Lỗi khi đổi mật khẩu");
      }
      alert("Đổi mật khẩu thành công");
    })
    .catch((error) => {
      alert(error.message);
    });
};
return (
  <div>
    (
      <div className={cx('change-password-container')}>
        <button className={cx('close-button')} onClick={handleClose}>
          X
        </button>
        <form className={cx('change-password-form')} onSubmit={handleSubmit}>
          <h2>Đổi mật khẩu</h2>
          
          <div>
            <label htmlFor="newPassword">Nhập mật khẩu mới:</label>
            <input
              type="password"
              id="newPassword"
              value={newpassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmNewPassword">Nhập lại mật khẩu mới:</label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confpassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
              required
            />
          </div>
          <button type="submit">Lưu thay đổi</button>
        </form>
      </div>
    )
  </div>
);
  }

export default ChangePassword;