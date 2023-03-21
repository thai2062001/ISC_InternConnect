import classNames from 'classnames/bind';
import styles from './settings.module.scss'
import { FaAngleDoubleRight, FaAngleDoubleLeft, FaArrowRight, FaLocationArrow, FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import Popup from "reactjs-popup";
import ChangePassword from './ChangePassword/changePassword';
import StudentName from './StudentName/studentName';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const cx = classNames.bind(styles)
function Settings() {
  const [showPopup, setShowPopup] = useState(false)
  const [showPopupInfo, setShowPopupInfo] = useState(false)
  const [info, setInfo] = useState([]);
  const [accounts, setAccount] = useState([])

  const [file, setFile] = useState(null);


  const Student_token = localStorage.getItem('user-save');
  const decodeEmail = jwt_decode(Student_token);
  const emailUser = decodeEmail.email;
  const usernameAccount = decodeEmail.username;
  const passwordAccount = decodeEmail.password;


  const URL = 'http://localhost:5000/admin/account'
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(URL)
      result.json().then(json => {
        setAccount(json)
      })
    }
    fetchData();
  }, []);
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

  const handleChangePw = () => {
    setShowPopup(true);
  }
  const handleUpdateInfo = () => {
    setShowPopupInfo(true);
  }
  const handlePopupFalse = () => {
    setShowPopupInfo(false)
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
  }

  const handleUploadCV = () => {
    const formData = new FormData();
    formData.append('cv1', file); // thêm file vào FormData
  
    fetch('http://localhost:5000/addcv', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${Student_token}`
      },
    })
    .then(response => response.json())
    .then(data => {
      console.log('Upload success:', data);
      // Thông báo thành công
      toast.success('Upload CV thành công!');
    })
    .catch(error => {
      console.error('Upload error:', error);
      // Thông báo lỗi
      toast.error('Upload CV thất bại!');
    });
  }
  const handleFileChange = (event) => {
    if (event.target) {
      setFile(event.target.files[0]);
      console.log(file);
    }
  }
  return (

    <div className={cx('wrapper')}>
      <h1>Settings</h1>
      <div className={cx('update-info-wrapper')}>

        <div className={cx('settings-option')}>
          <label htmlFor="changePassword">Upload CV:</label>
          <input className={cx('file_input')} 
          type="file" 
          accept="*" 
          onChange={(e) => handleFileChange(e.target.files[0])}
          />
          <button onClick={handleUploadCV} className={cx('action_button')} >Upload CV</button>
        </div>






        <div className={cx('settings-option')}>
          <label htmlFor="changePassword">Đổi mật khẩu:</label>
          <input className={cx('password_input')} value="************" />
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
        <Popup open={showPopupInfo} onClose={() => handlePopupFalse()}>
          <StudentName name={info.studentname} address = {info.address} gender = {info.gender} code = {info.code} major ={info.major} school ={info.school}
            onClose={() => setShowPopupInfo(false)}
          />
        </Popup>
        <ToastContainer/>
      </div>

   
  );
};


export default Settings;