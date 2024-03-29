
import classNames from 'classnames/bind';
import styles from './forgotpw.module.scss'
import {  useState } from 'react';

const cx = classNames.bind(styles)


function ForgotPW() {
    const [email, setEmail] = useState('');

    const handleForgot = (email)=>{
        
    fetch('http://localhost:5000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }

    return ( 
        <div className={cx('forgot-password-container')}>
          <div className={cx('forgot-password-popup')}>
          <h1>Quên mật khẩu</h1>
            <label htmlFor="email">Nhập email:</label>
            <input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={()=>handleForgot(email)}>Đặt lại mật khẩu</button>
          </div>
      </div>
    );
  
}

export default ForgotPW;