import classNames from "classnames/bind";
import styles from "./Signup.module.scss";
import { FaUserAlt, FaLock, FaEnvelope, FaPhoneAlt, FaSchool } from "react-icons/fa";

import axios, { Axios } from "axios";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
const cx = classNames.bind(styles);

function Signup() {
  const [account, setAccount] = useState([]);
  const [schoolList, setSchoolList] = useState([{'nameschool': '', 'id':''}])
  useEffect(() =>{
    const fecthData = async () =>{
      const response = await fetch("http://localhost:5000/admin/school");
      const newData = await response.json();
      setSchoolList(newData);
    }
    fecthData();
  }, [])

  const HandleSignup = async () => {
    try {
      const formData = new FormData();
      formData.append('username', document.getElementById('username').value);
      formData.append('email', document.getElementById('Email').value);
      formData.append('password', document.getElementById('password').value);
      formData.append('confpassword', document.getElementById('repass').value);
      formData.append('gender', document.getElementById('gender').value);
      formData.append('phonenumber', document.getElementById('phone').value);
      formData.append('school', document.getElementById('school').value);

      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(response.status);
      }
      const data = await response.json();
    } catch (error) {
      console.log(error);
    }
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
            <h2 className={cx("title")}>Welcome</h2>
            <div className={cx("input-div user")}>
              <div className={cx("i")}>
                <FaUserAlt />
              </div>
              <div className={cx("div")}>
                <input
                  placeholder="Username"
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
                  placeholder="Phone number"
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
                  placeholder="Password"
                  type="password"
                  id="password"
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
                  placeholder="Re-enter password"
                  type="password"
                  id="repass"
                  className={cx("input-user")}
                />
              </div>
            </div>
            <div className={cx("input-div phone")}>
            <div className={cx("i")}>
                <FaSchool />
              </div>
              <div className={cx("div")}>
                <select name="school" className={cx("input-school")}>
                  <option id="school" value="schoolName">Choose School Name</option>
                  {
                    schoolList.map(school =>(
                      <option  key = {school.id}>{school.nameschool}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className={cx("input-div gender")}>
              <div className={cx("div-gender")}>
                <input
                  name="gender"
                  type="radio"
                  id="gender"
                  className={cx("input-gender")}
                  value="Male"
            
                />{" "}
                <span className={cx("gender")}>Male</span>
                <input
                  name="gender"
                  type="radio"
                  id="gender"
                  className={cx("input-gender")}
                  value="Female"
             
                />{" "}
                <span className={cx("gender")}>Female</span>
              </div>
            </div>
            <button onClick={HandleSignup} className={cx("btn")}>
              Signup
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
