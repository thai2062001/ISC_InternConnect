import classNames from 'classnames/bind';
import styles from './Login.module.scss'

import axios, { Axios } from 'axios';
import { useState,useEffect } from "react";
import jwt_decode from "jwt-decode";

const cx = classNames.bind(styles)


function Login() {

  const [email,setEmail] = useState("")
  const [password,setpassword] = useState("")
  const [account,setAccount] = useState([])

 
  useEffect(()=>{
    
  },[]);

   async function HandleLogin(e){
    try{
      
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,password})
      // setEmail(response.data.email)
      // setpassword(response.data.password)
      console.log(response.data.token.accessToken);
      const token = response.data.token.accessToken
      var decoded = jwt_decode(token);
      
      const localstored = localStorage.setItem('user-save',token)
      console.log(decoded);
      console.log(localstored);
      
      if(decoded.role === 'Admin'){

        window.location.href = '/homeadmin'

      }else if(decoded.role === 'School')
      {
          window.location.href = '/school'
      }
      else if(decoded.role === 'Student')
      {

      }
      else if(decoded.role === 'Company')
      {

      }

    }
    catch(error) {
      console.log(error);
    };
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
           		   		<i className={cx('fas fa-user')}></i>
           		   </div>
           		   <div className={cx('div')}>
           		   		<h5>Username</h5>
           		   		<input type="text" className={cx('input')} onChange={(e)=>setEmail(e.target.value)}/>
           		   </div>
           		</div>
           		<div className={cx('input-div pass')}>
           		   <div className={cx('i')}> 
           		    	<i className={cx('fas fa-lock')}></i>
           		   </div>
           		   <div className={cx('div')}>
           		    	<h5>Password</h5>
           		    	<input type="password" className={cx('input')} onChange={(e)=>setpassword(e.target.value)}/>
            	   </div>
            	</div>
            	<a href="#">Forgot Password?</a>
            	<button onClick={HandleLogin} className={cx('btn')}>Login</button>
            </div>
        </div>
    </div>

        
      </div>

  )

}

export default Login;