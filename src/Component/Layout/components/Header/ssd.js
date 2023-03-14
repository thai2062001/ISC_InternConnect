
import classNames from 'classnames/bind';
import styles from './Header.module.scss'
import { FaUser ,FaSignOutAlt} from 'react-icons/fa';
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';

import logo from './HeaderLogin/logo.png';
const cx = classNames.bind(styles)

    const token = localStorage.getItem('user-save');
    const decodeEmail = jwt_decode(token);
    const username = decodeEmail.username;

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user-save'));


  const handleLogin = () => {
    window.location.href = "/login"
  }
  const handleLogo = () => {
    window.location.href = '/'
  }
  const handleLogout = () => {
    // Xóa token
    localStorage.removeItem('user-save');
    // Ẩn thẻ <p> và icon logout
    setIsLoggedIn(false);
  }

  return (
    <header className={cx('header')}>
      <div className={cx('inner')}>
        <div className={cx('header__logo')}>
          <img onClick={handleLogo} className={cx('logo')} src={logo} />
        </div>

        <nav className={cx('header__nav')}>
          <ul className={cx('header__list')}>
            <li className={cx('header__item')}><a href="/">Home</a></li>
            <li className={cx('header__item')}><a href="/about">Job Search</a></li>
            <li className={cx('header__item')}><a href="/contact">Contact</a></li>
          </ul>
          <div className={cx('header__actions')}>
            <FaUser onClick={handleLogin} className={cx('header__login')} />
            {isLoggedIn && (
      <div>
        <FaSignOutAlt onClick={handleLogout} />
        <p>{decodeEmail.username}</p>
      </div>
    )}
          </div>
        </nav></div>


    </header>
  );
}

export default Header;