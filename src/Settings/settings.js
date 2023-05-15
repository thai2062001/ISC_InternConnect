import classNames from 'classnames/bind';
import styles from './settings.module.scss'
import { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import Popup from "reactjs-popup";
import ChangePassword from './ChangePassword/changePassword';
import StudentName from './StudentName/studentName';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Helmet } from 'react-helmet';

const cx = classNames.bind(styles)
function Settings() {
  const [showPopup, setShowPopup] = useState(false)
  const [showPopupInfo, setShowPopupInfo] = useState(false)
  const [info, setInfo] = useState({});
  const Student_token = localStorage.getItem('user');
  const decodeEmail = jwt_decode(Student_token);

  //http://localhost:5000/profile
  useEffect(() => {
    async function fetchData() {
      try {
        const options = {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + Student_token,
            'Content-Type': 'application/json'
          }
        };
        const response = await fetch('http://localhost:5000/profile', options);
        const data = await response.json();
        setInfo(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [Student_token]);


  const handleChangePw = () => {
    setShowPopup(true);
  }
  const handleUpdateInfo = () => {
    setShowPopupInfo(true);
  }
  const handlePopupFalse = () => {
    setShowPopupInfo(false)
  }

  return (

    <div className={cx('wrapper')}>
      <Helmet>
        <title>Cài đặt </title>
      </Helmet>
      <h1>Cài đặt</h1>
      <div className={cx('update-info-wrapper')}>

        <div className={cx('settings-option')}>
          <label htmlFor="changePassword">Đổi mật khẩu:</label>
          <button className={cx('action_button')} onClick={handleChangePw} id="changePassword">Đổi mật khẩu</button>
        </div>
        <Popup open={showPopup} onClose={() => setShowPopup(false)}>
          <ChangePassword
            onClose={() => setShowPopup(false)}
          />
        </Popup>
      </div>

      <div className={cx('settings-option')}>
        <label htmlFor="UpdateInfo">Thông tin cá nhân:</label>
        <button className={cx('action_button')} onClick={handleUpdateInfo} id="UpdateInfo">Cập nhật thông tin</button>
      </div>
      {info.profile && (
        <Popup open={showPopupInfo} onClose={() => handlePopupFalse()}>
          <StudentName
            avatar={info.profile.avatar}
            name={info.profile.studentname}
            phoneNumber={info.profile.studentphone}
            address={info.profile.address}
            gender={info.profile.gender}
            code={info.profile.code}
            major={info.profile.major}
            school={info.profile.school}
            onClose={() => setShowPopupInfo(false)}
          />
        </Popup>
      )}
      <ToastContainer />
    </div>


  );
};


export default Settings;