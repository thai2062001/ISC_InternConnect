import classNames from 'classnames/bind';
import styles from './settings.module.scss'
import { FaAngleDoubleRight, FaAngleDoubleLeft, FaArrowRight, FaLocationArrow, FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import Popup from "reactjs-popup";
import ChangePassword from './ChangePassword/changePassword';



const cx = classNames.bind(styles)
function Settings() {
    const [showPopup, setShowPopup] = useState(false)

    const handleChangePw = ()=>{
        setShowPopup(true);
    }
    return (
        <div className={cx('wrapper')}>
        <h1>Settings</h1>
        <div className={cx('settings-item')}>
    <label htmlFor="studentName">Student Name:</label>
        <p>Demo</p>
  </div>

  <div className={cx('settings-item')}>
    <label htmlFor="address">Address:</label>
    <p>Demo</p>

  </div>

  <div className={cx('settings-item')}>
    <label htmlFor="code">Code:</label>
    <p>Demo</p>

  </div>

  <div className={cx('settings-item')}>
    <label htmlFor="major">Major:</label>
    <p>Demo</p>

  </div>

  <div className={cx('settings-item')}>
    <label htmlFor="school">School:</label>
    <p>Demo</p>

  </div>
  <div className={cx('update-info-wrapper')}>
    <label htmlFor="info">Cập nhật thông tin:</label>
    <button  className={cx('update_info')}>Cập nhật</button>
  </div>
        <div className={cx('settings-option')}>
          <label htmlFor="changePassword">Đổi mật khẩu:</label>
          <span>123456</span>
          <button onClick={handleChangePw} id="changePassword">Đổi mật khẩu</button>
         
        </div>
        <Popup open={showPopup} onClose={() => setShowPopup(false)}>
                                <ChangePassword
                                    onClose={() => setShowPopup(false)}
                                />
                            </Popup>
        <div className={cx('settings-option')}>
          <label htmlFor="changeUsername"> Username:</label>
          <span>Thai113</span>
          <button id="changeUsername">Đổi username</button>
        </div>
      </div>
      );
    };


export default Settings;