import classNames from "classnames/bind";
import styles from "./Signup.module.scss";
import { FaUserAlt, FaLock, FaEnvelope, FaPhoneAlt, FaSchool } from "react-icons/fa";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const cx = classNames.bind(styles);

function Signup() {
  const [account, setAccount] = useState([]);
  const [schoolList, setSchoolList] = useState([{ 'nameschool': '', 'id': '' }])
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confpassword, setConfirmPass] = useState('');
  const [phonenumber, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [school, setSchool] = useState('');

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReNewPassword, setShowReNewPassword] = useState(false);

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

  function handleOptionChange(event) {
    setSchool(event.target.value);
  }
  function handleEmailChange(event) {
    setEmail(event.target.value);
  }
  useEffect(() => {
    const fecthData = async () => {
      const response = await fetch("http://localhost:5000/admin/school");
      const newData = await response.json();
      setSchoolList(newData);
    }
    fecthData();
  }, [])

  const checkDuplicate = () => {
    for (let i = 0; i < account.length; i++) {
      if (
        account[i].username === username ||
        account[i].email === email ||
        account[i].phonenumber === phonenumber
      ) {
        return true;
      }
    }
    return false;
  };

  const HandleSignup = (email) => {

    for (let i = 0; i < account.length; i++) {
      if (account[i].username === username) {
        toast.error("Tên tài khoản đã tồn tại");
        return;
      }
      else if (account[i].email === email) {
        toast.error("Email đã tồn tại");
        return;
      }
      else if (account[i].phonenumber === phonenumber) {
        toast.error("Số điện thoại đã tồn tại");
        return;
      }
    }

    if (password !== confpassword) {
      toast.error("Mật khẩu không trùng khớp");
      return;
    }
    fetch('http://localhost:5000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, confpassword, phonenumber, gender, school })
    })
      .then(response => response.json())
      .then(data => {
        window.location.href = '/login'
      })
      .catch(error => console.error(error));
  };

  const togglePasswordNewVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  const togglePasswordRenewVisibility = () => {
    setShowReNewPassword(!showReNewPassword);
  };
  return (
    <div>
      <img
        className={cx("wave")}
        src="https://github.com/sefyudem/Responsive-Login-Form/blob/master/img/wave.png?raw=true"
      />
      <div className={cx("container")}>
        <div className={cx("img")}>
          <img src="https://raw.githubusercontent.com/sefyudem/Responsive-Login-Form/82b8d8efd3b0ac6382b9d0d71a99c6cf9dcefa23/img/bg.svg" />
        </div>
        <div className={cx("login-content")}>
          <div>
            <img src="https://raw.githubusercontent.com/sefyudem/Responsive-Login-Form/82b8d8efd3b0ac6382b9d0d71a99c6cf9dcefa23/img/avatar.svg" />
            <h2 className={cx("title")}>Đăng kí</h2>
            <div className={cx("input-div user")}>
              <div className={cx("i")}>
                <FaUserAlt />
              </div>
              <div className={cx("div")}>
                <input
                  placeholder="Tên tài khoản"
                  value={username}
                  onChange={(e) => (setName(e.target.value))}
                  type="text"
                  id="username"
                  className={cx("input-user")}
                />
              </div>
            </div>
            <div className={cx("input-div mail")}>
              <div className={cx("i")}>
                <FaEnvelope />
              </div>
              <div className={cx("div")}>
                <input
                  placeholder="Email"
                  onChange={handleEmailChange}
                  type="text"
                  id="Email"
                  className={cx("input-user")}
                />
              </div>
            </div>
            <div className={cx("input-div phone")}>
              <div className={cx("i")}>
                <FaPhoneAlt />
              </div>
              <div className={cx("div")}>
                <input
                  placeholder="Số điện thoại"
                  value={phonenumber}
                  onChange={(e) => (setPhone(e.target.value))}
                  type="text"
                  id="phone"
                  className={cx("input-user")}
                />
              </div>
            </div>
            <div className={cx("input-div pass")}>
              <div className={cx("i")}>
                <FaLock />
              </div>
              <div className={cx("div")}>
                <input
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => (setPassword(e.target.value))}
                  type={showNewPassword ? "text" : "password"}
                  id="password"
                  className={cx("input-user")}
                />
                <div onClick={togglePasswordNewVisibility} className={cx('hide-icon')}>
                  {!showNewPassword ? (<img src="https://img.icons8.com/material/24/null/visible--v1.png" />)
                    : (<img src="https://img.icons8.com/external-febrian-hidayat-glyph-febrian-hidayat/64/null/external-closed-eyes-user-interface-febrian-hidayat-glyph-febrian-hidayat.png" />)
                  }
                </div>
              </div>
            </div>
            <div className={cx("input-div pass")}>
              <div className={cx("i")}>
                <FaLock />
              </div>
              <div className={cx("div")}>
                <input
                  placeholder="Nhập lại mật khẩu"
                  value={confpassword}
                  onChange={(e) => (setConfirmPass(e.target.value))}
                  type={showReNewPassword ? "text" : "password"}
                  id="repass"
                  className={cx("input-user")}
                />
                <div onClick={togglePasswordRenewVisibility} className={cx('hide-icon')}>
                  {!showReNewPassword ? (<img src="https://img.icons8.com/material/24/null/visible--v1.png" />)
                    : (<img src="https://img.icons8.com/external-febrian-hidayat-glyph-febrian-hidayat/64/null/external-closed-eyes-user-interface-febrian-hidayat-glyph-febrian-hidayat.png" />)
                  }
                </div>
              </div>
            </div>
            <div className={cx("input-div phone")}>
              <div className={cx("i")}>
                <FaSchool />
              </div>
              <div className={cx("div")}>
                <select value={school} onChange={handleOptionChange} name="school" className={cx("input-school")}>
                  <option value="schoolName">Chọn trường đang theo học</option>
                  {
                    schoolList.map(school => (
                      <option id="school" key={school.id}>{school.nameschool}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <ToastContainer />
            <div className={cx("input-div gender")}>
              <div className={cx("div-gender")}>
                <input
                  name="gender"
                  onChange={(e) => (setGender(e.target.value))}
                  type="radio"
                  id="gender"
                  className={cx("input-gender")}
                  value="Nam"
                />
                <span className={cx("gender")}>Nam</span>
                <input
                  name="gender"
                  onChange={(e) => (setGender(e.target.value))}
                  type="radio"
                  id="gender"
                  className={cx("input-gender")}
                  value="Nữ"
                />
                <span className={cx("gender")}>Nữ</span>
              </div>
            </div>
            <button onClick={() => { HandleSignup(email) }} className={cx("btn")}>
              Đăng kí
            </button>
          </div>
        </div>
      </div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
    </div>
  );
}

export default Signup;
