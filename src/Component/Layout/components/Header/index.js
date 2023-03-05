
import classNames from 'classnames/bind';
import styles from './Header.module.scss'
import { FaBars, FaUser } from 'react-icons/fa';

const cx = classNames.bind(styles)

const handleLogin = () => {
  window.location.href = "/login"
}

function Header() {
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
          </div>
        </nav></div>


    </header>
  );
}

export default Header;