
import classNames from 'classnames/bind';
import styles from './Header.module.scss'
import { FaUser } from 'react-icons/fa';
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import logo from './HeaderLogin/logo.png';
const cx = classNames.bind(styles)



function Header() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [info, setInfo] = useState({});
  const [avatar, setAvatar] = useState();

  const Student_token = localStorage.getItem('user');

  useEffect(() => {
    async function fetchData() {
      try {
        const options = {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + Student_token,
            'Content-Type': 'application/json'
          }
        };
        const response = await fetch('http://localhost:5000/profile', options);
        const data = await response.json();
        setAvatar(data.profile.avatar)
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [Student_token]);

  const handleLogin = () => {
    window.location.href = "/login"
  }
  const handleCV = () => {
    window.location.href = "/statuscv"
  }
  const handleFavorite = () => {
    window.location.href = "/favorite_jobapp"
  }

  const handleSettings = () => {
    window.location.href = "/accountSettings"
  }
  const handleLogo = () => {
    window.location.href = '/'
  }

  
  const handleLogOut = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUsername('');
    window.location.href = '/';
  }


  const handleName = () => {
    const jobpost_token = localStorage.getItem('user');
    if (jobpost_token) {
      const decodeEmail = jwt_decode(jobpost_token);
      const Username = decodeEmail.username;
      setUsername(Username);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  }

  useEffect(() => {
    handleName();
  }, []);



  return (
    <header className={cx('header')}>
      <div className={cx('inner')}>
        <div className={cx('header__logo')}>
          <img onClick={handleLogo} className={cx('logo')} src={logo} />
        </div>

        <nav className={cx('header__nav')}>
          <ul className={cx('header__list')}>
            <li className={cx('header__item')}><a href="/">Trang chủ</a></li>
            <li className={cx('header__item')}><a href="/listcompany">Công ty</a></li>
            <li className={cx('header__item')}><a href="#">Liên hệ</a></li>
          </ul>
          <div className={cx('header__actions')}>
            {isLoggedIn ? (
              <>
                <span>{username}</span>
                <div className={cx('menu_item')}>
                  <ul className="header__login-menu">
                    <li className={cx('menu-li')} onClick={handleSettings}>
                      Cài đặt
                    </li>
                    <li className={cx('menu-li')} onClick={handleCV}>
                      Theo dõi hồ sơ việc làm 
                    </li>
                    <li className={cx('menu-li')} onClick={handleFavorite}>
                      Bài đăng yêu thích
                    </li>
                    <li className={cx('menu-li')} onClick={handleLogOut}>
                      Đăng xuất
                    </li>
                  </ul>
                </div>
                {avatar && <img className={cx('avatar')} src={avatar} alt="Avatar" />}
              </>
            ) : (
              <FaUser onClick={handleLogin} className={cx('header__login')} />
            )}
          </div>
        </nav></div>


    </header>
  );
}

export default Header;