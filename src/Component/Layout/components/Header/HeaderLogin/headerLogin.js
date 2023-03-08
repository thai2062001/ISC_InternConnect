
import classNames from 'classnames/bind';
import styles from './headerLogin.module.scss'
import { FaUser } from 'react-icons/fa';
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
const cx = classNames.bind(styles)



function HeaderLogin() {
  const [name, setName] = useState('')
  const [accounts, setAccount] = useState([])


        
  useEffect(() => {
    const localstore = localStorage.getItem('user-save')
    const decodeUser = jwt_decode(localstore);
    console.log(decodeUser.username);
    console.log(decodeUser.email);
    setName(decodeUser.username)
}, [])
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

  const handleLogin = () => {
    window.location.href = "/login"
  }
  return (
    <header className={cx('header')}>
      <div className={cx('inner')}>
        <div className={cx('header__logo')}>
        <a href="/">Logo</a>
      </div>
        <nav className={cx('header__nav')}>
          <ul className={cx('header__list')}>
            <li className={cx('header__item')}><a href="/">Home</a></li>
            <li className={cx('header__item')}><a href="/about">Job Search</a></li>
            <li className={cx('header__item')}><a href="/contact">Contact</a></li>
          </ul>
          <div className={cx('header__actions')}>
            <FaUser onClick={handleLogin} className={cx('header__login')} />
            <p>{name}</p>
          </div>
        </nav></div>


    </header>
  );
}

export default HeaderLogin;