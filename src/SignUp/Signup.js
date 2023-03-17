import classNames from "classnames/bind";
import styles from "./Signup.module.scss";
import { FaUserAlt, FaLock, FaEnvelope, FaPhoneAlt, FaSchool } from "react-icons/fa";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const cx = classNames.bind(styles);

function Signup() {
  const [account, setAccount] = useState([]);
  const [schoolList, setSchoolList] = useState([{'nameschool': '', 'id':''}])
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confpassword, setConfirmPass] = useState('');
  const [phonenumber, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [school, setSchool] = useState('');

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
  useEffect(() =>{
    const fecthData = async () =>{
      const response = await fetch("http://localhost:5000/admin/school");
      const newData = await response.json();
      setSchoolList(newData);
    }
    fecthData();
  }, [])


  const HandleSignup =  (email) => {

    fetch('http://localhost:5000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password ,confpassword,phonenumber,gender,school})
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
      })
      .catch(error => console.error(error));
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
                  value= {username}
                  onChange={(e)=>(setName(e.target.value))}
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
                  placeholder="Phone number"
                  value={phonenumber}
                  onChange={(e)=>(setPhone(e.target.value))}
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
                  value={password}
                  onChange={(e)=>(setPassword(e.target.value))}
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
                  value={confpassword}
                  onChange={(e)=>(setConfirmPass(e.target.value))}
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
                <select  value={school} onChange={handleOptionChange} name="school" className={cx("input-school")}>
                  <option  value="schoolName">Choose School Name</option>
                  {
                    schoolList.map(school =>(
                      <option   id="school" key = {school.id}>{school.nameschool}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className={cx("input-div gender")}>
              <div className={cx("div-gender")}>
                <input
                  name="gender"
                  onChange={(e)=>(setGender(e.target.value))}
                  type="radio"
                  id="gender"
                  className={cx("input-gender")}
                  value="Male"
            
                />
                <span className={cx("gender")}>Male</span>
                <input
                  name="gender"
                  onChange={(e)=>(setGender(e.target.value))}
                  type="radio"
                  id="gender"
                  className={cx("input-gender")}
                  value="Female"
             
                />
                <span className={cx("gender")}>Female</span>
              </div>
            </div>
            <button onClick={()=>{HandleSignup(email)}} className={cx("btn")}>
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
