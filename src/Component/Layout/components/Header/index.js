
import classNames from 'classnames/bind';
import styles from './Header.module.scss'
import { FaUser } from 'react-icons/fa';
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';

import logo from './HeaderLogin/logo.png';
const cx = classNames.bind(styles)



function Header() {
  const handleLogin = () => {
    window.location.href = "/login"
  }

  const handleSettings = () => {
    window.location.href = "/accountSettings"
  }
  const handleLogo = () => {
    window.location.href = '/'
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
           <div className={cx('menu_item')}>
           <ul className="header__login-menu">
            <li className={cx('menu-li')} onClick={handleLogin}>Đăng nhập</li>
            <li className={cx('menu-li')}  onClick={handleSettings} >Cài đặt</li>
            <li className={cx('menu-li')} >Đăng xuất</li>
          </ul>
           </div>

          </div>
        </nav></div>


    </header>
  );
}

export default Header;