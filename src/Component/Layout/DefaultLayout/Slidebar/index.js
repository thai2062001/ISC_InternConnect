import React, { useState,useEffect } from 'react';
import classNames from "classnames/bind";
import styles from './Slidebar.module.scss'
const cx = classNames.bind(styles)

function Slidebar() {

  function handleLogOutUser() {
    localStorage.removeItem('user-save');
    window.location.href = '/admin/adminlogin'
}
  return (
    <div className={cx('slidebar')}>

<div className={cx('sidebar')}>
    <div className={cx('logo-details')}>
        <i className={cx('bx bx-menu')} id="btn" ></i>
    </div>
    <ul className={cx('nav-list')}>
      <li>
        <a href="/homeadmin">
          <i className={cx('bx bx-user')}></i>
          <span className={cx('links_name')}>Quản lý tài khoản</span>
        </a>
         <span className={cx('tooltip')}>Quản lý tài khoản</span>
      </li>
      <li>
       <a href="/homeadmin/schoolAdmin">
        
         <i className={cx('bx bxs-school')} ></i>
         <span className={cx('links_name')}>Quản lý trường</span>
       </a>
       <span className={cx('tooltip')}>Quản lý trường</span>
     </li>
     <li>
       <a href="/homeadmin/majorAdmin">
         <i className={cx('bx bx-math')} ></i>
         <span className={cx('links_name')}>Quản lý nghề nghiệp</span>
       </a>
       <span className={cx('tooltip')}>Quản lý nghề nghiệp</span>
     </li>

     <li>
       <a href="/homeadmin/companyAdmin">
         <i className='bx bx-building-house' ></i>
         <span className={cx('links_name')}>Quản lý công ty</span>
       </a>
       <span className={cx('tooltip')}>Quản lý công ty</span>
     </li>
    
     <li>
       <a href="/homeadmin/jobpost">
         <i className='bx bx-list-ul' ></i>
         <span className={cx('links_name')}>Quản lý bài đăng</span>
       </a>
       <span className={cx('tooltip')}>Quản lý bài đăng</span>
     </li>
     <li>
       <a href="/homeadmin/report">
       <i className='bx bx-list-ul' ></i>
         <span className={cx('links_name')}>Quản lý báo cáo </span>
       </a>
       <span className={cx('tooltip')}>Quản lý báo cáo </span>
     </li>

     <li className={cx('profile')}>
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