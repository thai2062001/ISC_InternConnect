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
    const [info, setInfo] = useState('');
   

    const Student_token = localStorage.getItem('user-save');
    const decodeEmail = jwt_decode(Student_token);
    const emailUser = decodeEmail.email;

    //http://localhost:5000/profile
    useEffect(() => {
      const fetchData = async () => {
          const infoStudent = 'http://localhost:5000/profile'
          const result = await fetch(infoStudent, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${Student_token}`
              },
          })
          const json = await result.json();
          const student = json.profile.find(item => item.studentemail === emailUser);
          if (student) {
            setInfo(student);
          } else {
            console.error('Không tồn tại bài đăng có id này');
          }
      }
      fetchData();
    }, []);

  console.log(info);

  
    const handleChangePw = ()=>{
        setShowPopup(true);
    }
    const handleUpdate = ()=>{

    }
    return (
        <div className={cx('wrapper')}>
        <h1>Settings</h1>
        <div className={cx('settings-item')}>
    <label htmlFor="studentName">Student Name:</label>
        <input className={cx('info_input')} value={info.studentname}/>
        <span className={cx('action_span')} onClick={handleUpdate}>Sửa</span>
  </div>

  <div className={cx('settings-item')}>
    <label htmlFor="address">Address:</label>
    <input className={cx('info_input')} value={info.address}/>
    <span className={cx('action_span')} onClick={handleUpdate}>Sửa</span>

  </div>

  <div className={cx('settings-item')}>
    <label htmlFor="code">Student Code:</label>
    <input className={cx('info_input')} value={info.code}/>
    <span className={cx('action_span')} onClick={handleUpdate}>Sửa</span>

  </div>

  <div className={cx('settings-item')}>
    <label htmlFor="major">Major:</label>
    <input className={cx('info_input')} value={info.major}/>
    <span className={cx('action_span')} onClick={handleUpdate}>Sửa</span>

  </div>
  <div className={cx('settings-item')}>
    <label htmlFor="school">School:</label>
    <input className={cx('info_input')} value={info.school}/>
    <span className={cx('action_span')} onClick={handleUpdate}>Sửa</span>

  </div>
  <div className={cx('update-info-wrapper')}>
  </div>
        <div className={cx('settings-option')}>
          <label htmlFor="changePassword">Đổi mật khẩu:</label>
          <span className={cx('info_span')} >123456</span>
          <button onClick={handleChangePw} id="changePassword">Đổi mật khẩu</button>
         
        </div>
        <Popup open={showPopup} onClose={() => setShowPopup(false)}>
                                <ChangePassword
                                    onClose={() => setShowPopup(false)}
                                />
                            </Popup>
        <div className={cx('settings-option')}>
          <label htmlFor="changeUsername"> Username:</label>
          <span className={cx('info_span')}>Thai113</span>
          <button id="changeUsername">Đổi username</button>
        </div>
      </div>
      );
    };


export default Settings;