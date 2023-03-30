import classNames from 'classnames/bind';
import styles from './studentName.module.scss'
import { FaAngleDoubleRight, FaAngleDoubleLeft, FaArrowRight, FaLocationArrow, FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const cx = classNames.bind(styles)
function StudentName(props) {

    const [studentName, setStudentName] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [Code, setCode] = useState("");
    const [Major, setMajor] = useState("");
    const [School, setSchool] = useState("");
    const jobpost_token = localStorage.getItem('user');
    const decodeEmail = jwt_decode(jobpost_token);

 
    useEffect(()=>{
      setStudentName(props.name)
      setGender(props.gender)
      setAddress(props.address)
      setCode(props.code)
      setMajor(props.major)
      setSchool(props.school)

    },[])

    const handleClose = () => {
        if (props.onClose) {
          props.onClose();
        }
      };

    const handleChangeInfo = async (event) => {
      event.preventDefault();
      const URL = 'http://localhost:5000/update-profile'
      const info_token = localStorage.getItem('user');

      const data = {
        studentname:studentName,
        gender:gender,
        address:address,
        code:Code,
        major:Major,
        school:School,
      };
    
      try {
        const response = await fetch(URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${info_token}`,
          },
          body: JSON.stringify(data),
        });
    
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Something went wrong!');
        }
    
        const result = await response.json();
        toast.success('Sucess!', {
          position: "top-right",
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
        toast.error(error.message || 'Failed to change Info!');
      }
      } 

return (
  <div>
    (
      <div className={cx('change-password-container')}>
        <button className={cx('close-button')} onClick={handleClose}>
          X
        </button>
        <form className={cx('change-password-form')} onSubmit={handleChangeInfo}>
          <h2>Cập nhật thông tin cá nhân</h2>
          <div className={cx('wrapper')}>
            <label className={cx('lable_input')} htmlFor="studentName"> Name:</label>
            <input
              className={cx('pass_input')}
              type="text"
              id="studentName"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              required
            />
            <label className={cx('lable_input')} htmlFor="gender"> Gender:</label>
            <input
              className={cx('pass_input')}
              type="text"
              id="gender"
              value={gender}
              onChange={(event) => setGender(event.target.value)}
              required
            />
            <label className={cx('lable_input')} htmlFor="Address"> Address:</label>
            <input
              className={cx('pass_input')}
              type="text"
              id="Address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
            />
            <label className={cx('lable_input')} htmlFor="Code"> Code:</label>
            <input
              className={cx('pass_input')}
              type="text"
              id="Code"
              value={Code}
              onChange={(event) => setCode(event.target.value)}
              required
            />

            <label className={cx('lable_input')} htmlFor="Major"> Major:</label>
            <input
              className={cx('pass_input')}
              type="text"
              id="Major"
              value={Major}
              onChange={(event) => setMajor(event.target.value)}
              required
            />
            <label className={cx('lable_input')} htmlFor="Code"> School:</label>
            <input
              className={cx('pass_input')}
              type="text"
              id="School"
              value={School}
              onChange={(event) => setSchool(event.target.value)}
              required
            />

          </div>
        <div className={cx('action_buttons')}>
        <button className={cx('submit_button')} type="submit">Lưu thay đổi</button>
       
        </div>
         
       
        </form>
      </div>
    )
  </div>
);
  }

export default StudentName;