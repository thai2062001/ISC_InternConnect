import classNames from 'classnames/bind';
import styles from './changPassword.module.scss'
import { FaAngleDoubleRight, FaAngleDoubleLeft, FaArrowRight, FaLocationArrow, FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const cx = classNames.bind(styles)
function ChangePassword(props) {

    const [oldPass, setOldPassword] = useState("");
    const [newPass, setNewPassword] = useState("");
    const [cfmPass, setConfirmNewPassword] = useState("");

    const jobpost_token = localStorage.getItem('user');
    const decodeEmail = jwt_decode(jobpost_token);
    const email = decodeEmail.email;

    const handleClose = () => {
        if (props.onClose) {
          props.onClose();
        }
      };

  
    const handleChangePassword = async (event) => {
      event.preventDefault();
      const URL = 'http://localhost:5000/setting/change-password';
      const jobapptoken = localStorage.getItem('user');
    
      const data = {
        oldPass: oldPass,
        newPass: newPass,
        cfmPass: cfmPass,
      };
    
      try {
        const response = await fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jobapptoken}`,
          },
          body: JSON.stringify(data),
        });
    
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Something went wrong!');
        }
    
        const result = await response.json();
        console.log(result);
        toast.success('Change password successfully!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
        console.log(error);
        toast.error(error.message || 'Failed to change password!');
      }
    };

return (
  <div>
    (
      <div className={cx('change-password-container')}>
        <button className={cx('close-button')} onClick={handleClose}>
          X
        </button>
        <form className={cx('change-password-form')} onSubmit={handleChangePassword}>
          <h2>Đổi mật khẩu</h2>
          <div>
            <label className={cx('lable_input')} htmlFor="oldpassword">Nhập mật khẩu cũ:</label>
            <input
            className={cx('pass_input')}
              type="text"
              id="oldpassword"
              value={oldPass}
              onChange={(event) => setOldPassword(event.target.value)}
              required
            />
          </div>
          
          <div>
            <label className={cx('lable_input')} htmlFor="newPassword">Nhập mật khẩu mới:</label>
            <input
              className={cx('pass_input')}
              type="text"
              id="newPassword"
              value={newPass}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </div>

          <div>
            <label className={cx('lable_input')} htmlFor="confirmNewPassword">Nhập lại mật khẩu mới:</label>
            <input
              className={cx('pass_input')}
              type="text"
              id="confirmNewPassword"
              value={cfmPass}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
              required
            />
          </div>
        
          <button className={cx('submit_button')} type="submit">Lưu thay đổi</button>
          
        </form>
      </div>
    )
  </div>
);
  }

export default ChangePassword;