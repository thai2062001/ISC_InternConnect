import classNames from 'classnames/bind';
import styles from './Login.module.scss'
import { FaUserAlt,FaLock  } from "react-icons/fa";

import axios, { Axios } from 'axios';
import { useState,useEffect } from "react";
import jwt_decode from "jwt-decode";
import Popup from "reactjs-popup";
import ForgotPW from './ForgotPW/forgotPW';
const cx = classNames.bind(styles)


function Login() {

  const [email,setEmail] = useState("")
  const [password,setpassword] = useState("")
  const [account,setAccount] = useState([])
  const [showPopup, setShowPopup] = useState(false)


  useEffect(()=>{
  },[]);

   async function HandleLogin(e){
    try{
      const response = await axios.post('http://localhost:5000/auth/login', {email,password})
      console.log(response.data.token.accessToken);
      const token = response.data.token.accessToken
      var decoded = jwt_decode(token);
      const localstored = localStorage.setItem('user-save',token)
      if(decoded.role === 'Student')
      {
        window.location.href = '/'
      }
    }
    catch(error) {
      console.log(error);
    };
   }
   const handleForgotPW = ()=>{
    window.location.href='/auth/forgot-password'
   }
   const handleSignUp = ()=>{
    window.location.href='/auth/confirm'
   }


return(
      <div>
      <img className={cx('wave')} src="https://github.com/sefyudem/Responsive-Login-Form/blob/master/img/wave.png?raw=true"/>
	<div className={cx('container')}>
		<div className={cx('img')}>
			<img src="https://raw.githubusercontent.com/sefyudem/Responsive-Login-Form/82b8d8efd3b0ac6382b9d0d71a99c6cf9dcefa23/img/bg.svg"/>
		</div>
		<div className={cx('login-content')}>
			<div >
				<img src="https://raw.githubusercontent.com/sefyudem/Responsive-Login-Form/82b8d8efd3b0ac6382b9d0d71a99c6cf9dcefa23/img/avatar.svg"/>
				<h2 className={cx('title')}>Welcome</h2>
           		<div className={cx('input-div one')}>
           		   <div className={cx('i')}>
                  <FaUserAlt/>
           		   </div>
           		   <div className={cx('div')}>
           		   		<input placeholder='Email' type="text" className={cx('input-user')} onChange={(e)=>setEmail(e.target.value)}/>
           		   </div>
           		</div>
           		<div className={cx('input-div pass')}>
           		   <div className={cx('i')}> 
                  <FaLock/>
           		   </div>
           		   <div className={cx('div')}>
           		    	<input placeholder='password' type="password" className={cx('input-user')} onChange={(e)=>setpassword(e.target.value)}/>
            	   </div>
            	</div>
              <div className={cx('wraper_link')}>
              <a className={cx('forgot_password')} onClick={handleForgotPW}>Forgot Password?</a>
              <a onClick={handleSignUp} >Sign Up?</a>

              </div>
            	
            	<button onClick={HandleLogin} className={cx('btn')}>Login</button>
            </div>
        </div>
    </div>

    <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
            />
      </div>
      

  )

}

export default Login;