import classNames from 'classnames/bind';
import styles from './changPassword.module.scss'
import { useState } from 'react';
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const cx = classNames.bind(styles)
function ChangePassword(props) {

  const [oldPass, setOldPassword] = useState("");
  const [newPass, setNewPassword] = useState("");
  const [cfmPass, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReNewPassword, setShowReNewPassword] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(true);


  const jobpost_token = localStorage.getItem('user');
  const decodeEmail = jwt_decode(jobpost_token);
  const email = decodeEmail.email;

  const handleClose = () => {
    setIsPopupOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    const URL = 'http://localhost:5000/setting/change-password';
    const jobapptoken = localStorage.getItem('user');
    const isValid = validatePasswords();
    if (!isValid) {
      return;
    }
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
      toast.success('Đổi mật khẩu thành công', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error('Nhập sai mật khẩu cũ' || 'Không thể đổi mật khẩu');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordNewVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  const togglePasswordRenewVisibility = () => {
    setShowReNewPassword(!showReNewPassword);
  };
  const validatePasswords = () => {
    if (newPass !== cfmPass) {
      toast.error("Mật khẩu không khớp!");
      return false;
    }
    return true;
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
          <div className={cx('password-wrapper')}>


            <div className={cx('password-content')}>
              <label className={cx('lable_input')} htmlFor="oldpassword">Nhập mật khẩu cũ:</label>
              <input
                className={cx('pass_input')}
                type={showPassword ? "text" : "password"}
                id="oldpassword"
                value={oldPass}
                onChange={(event) => setOldPassword(event.target.value)}
                required
              />
              <div onClick={togglePasswordVisibility} className={cx('hide-icon')}>
                {!showPassword ? (<img src="https://img.icons8.com/material/24/null/visible--v1.png" />)
                  : (<img src="https://img.icons8.com/external-febrian-hidayat-glyph-febrian-hidayat/64/null/external-closed-eyes-user-interface-febrian-hidayat-glyph-febrian-hidayat.png" />)
                }
              </div>
            </div>
            <div className={cx('password-content')}>
              <label className={cx('lable_input')} htmlFor="newPassword">Nhập mật khẩu mới:</label>
              <input
                className={cx('pass_input')}
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPass}
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
              <div onClick={togglePasswordNewVisibility} className={cx('hide-icon')}>
                {!showNewPassword ? (<img src="https://img.icons8.com/material/24/null/visible--v1.png" />)
                  : (<img src="https://img.icons8.com/external-febrian-hidayat-glyph-febrian-hidayat/64/null/external-closed-eyes-user-interface-febrian-hidayat-glyph-febrian-hidayat.png" />)
                }
              </div>
            </div>

            <div className={cx('password-content')}>
              <label className={cx('lable_input')} htmlFor="confirmNewPassword">Nhập lại mật khẩu mới:</label>
              <input
                className={cx('pass_input')}
                type={showReNewPassword ? "text" : "password"}
                id="confirmNewPassword"
                value={cfmPass}
                onChange={(event) => setConfirmNewPassword(event.target.value)}
                required
              />
              <div onClick={togglePasswordRenewVisibility} className={cx('hide-icon')}>
                {!showReNewPassword ? (<img src="https://img.icons8.com/material/24/null/visible--v1.png" />)
                  : (<img src="https://img.icons8.com/external-febrian-hidayat-glyph-febrian-hidayat/64/null/external-closed-eyes-user-interface-febrian-hidayat-glyph-febrian-hidayat.png" />)
                }
              </div>
            </div>

            <button className={cx('submit_button')} type="submit">Lưu thay đổi</button>
          </div>
        </form>
      </div>
      )
    </div>
  );
}

export default ChangePassword;