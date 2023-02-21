import React, { useState } from 'react';
import classNames from "classnames/bind";
import styles from './Slidebar.module.scss'


const cx = classNames.bind(styles)

function Slidebar() {


  return (
    <div className={cx('slidebar')}>
    <ul className={cx('menu')}>
      <li className={cx('menu-item')}>
        <a href="/homeadmin" className={cx('menu-link')}>Account</a>
      </li>
      <li className={cx('menu-item')}>
        <a href="/homeadmin/schooladmin" className={cx('menu-link')}>School</a>
      </li>
      <li className={cx('menu-item')}>
        <a href="/homeadmin/majorAdmin" className={cx('menu-link')}>Major</a>
      </li>
      <li className={cx('menu-item')}>
        <a href="/homeadmin/companyAdmin" className={cx('menu-link')}>Company</a>
      </li>
    </ul>
  </div>
  );
}

export default Slidebar;