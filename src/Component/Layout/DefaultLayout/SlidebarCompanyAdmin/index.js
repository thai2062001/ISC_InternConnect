import React, { useState,useEffect } from 'react';
import classNames from "classnames/bind";
import styles from './SlidebarCompanyAdmin.module.scss';

const cx = classNames.bind(styles)

function Slidebar() {
  function handleLogOutUser() {
    localStorage.removeItem('user-save');
    window.location.href = 'login'
}
  return (
    <div className={cx('slidebar')}>
<div className={cx('sidebar')}>
    <div className={cx('logo-details')}>
        <i className={cx('bx bx-menu')} id="btn" ></i>
       
    </div>
    <ul className={cx('nav-list')}>
    <li>
    </li>
      <li>
        <a href="/companyadmin">
          <i className={cx('bx bxs-school')}></i>
          <span className={cx('links_name')}>Quản lý bài đăng</span>
        </a>
         <span className={cx('tooltip')}>Quản lý bài đăng</span>
      </li>
      <li>
       <a href="/companyadmin/jobapp">
         <i className={cx('bx bxs-school')} ></i>
         <span className={cx('links_name')}>Quản lý hồ sơ ứng viên</span>
       </a>
       <span className={cx('tooltip')}>Quản lý hồ sơ ứng viên</span>
     </li>
      <li>
       <a href="/companyadmin/companyinfo">
         <i className={cx('bx bxs-school')} ></i>
         <span className={cx('links_name')}>Thiết lập thông tin</span>
       </a>
       <span className={cx('tooltip')}>Thiết lập thông tin</span>
     </li>

     <li >
     <a href="/admin/adminlogin" onClick={handleLogOutUser}>
     <div className={cx('profile-details')}></div>
         <i className={cx('bx bx-log-out')} id="log_out" ></i>
         <span className={cx('links_name')}>Đăng xuất</span>
     </a>
     <span className={cx('tooltip')}>Đăng xuất</span>
     </li>

    </ul>

  </div>

    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'/>
  </div>
  );
}

export default Slidebar;