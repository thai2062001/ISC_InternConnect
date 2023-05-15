import classNames from 'classnames/bind';
import styles from './auForgot.module.scss'
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";

const cx = classNames.bind(styles)
function AuForgot() {

  const [newPass, setPassword] = useState('');
  const [cfmPass, setConfirPassword] = useState('');
  const { id } = useParams();

  const url = new URL(window.location.href);
  const email = url.pathname.split('/').pop();



  const handleReset = () => {
    fetch(`http://localhost:5000/auth/forgot-password/${email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newPass, cfmPass })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        window.location.href = '/login'
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }



  const handleSubmit = (e) => {
    e.preventDefault();
  }
  return (
    <div className={cx('wrapper')}>

      <form className={cx('form-wrapper')} onClick={handleSubmit}>
        <h1>Đặt lại mật khẩu</h1>
        <div className={cx('password-wrapper')}>

          <label className={cx('label-input')}>
            Mật khẩu:
          </label>
          <div className={cx('pw-wrapper')}>
          <input className={cx('input-info')} type="password" onChange={(e) => setPassword(e.target.value)} />
          </div>



        </div>
        <div className={cx('password-wrapper')}>
          <label className={cx('label-input')}>
            Nhập lại mật khẩu:
          </label>
          <input className={cx('input-info')} type="password" onChange={(e) => setConfirPassword(e.target.value)} />
        </div>
        <button className={cx('action-button')} onClick={handleReset} type="submit">Lưu thay đổi</button>
      </form>
    </div>
  );
}

export default AuForgot;