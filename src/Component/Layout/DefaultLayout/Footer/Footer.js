import classNames from 'classnames/bind';
import styles from './Footer.module.scss'
import { FaFacebookF, FaTwitch, FaInstagram } from 'react-icons/fa';
import logo from '../Footer/logo.png'

const cx = classNames.bind(styles)

function Footer() {

  const handleLogo = () => {
    window.location.href = '/'
  }

    
    return (
      <div className={cx('page-wrapper')}>
        <footer className={cx('footer')}>
          <div className={cx('footer__content')}>
            <div className={cx( 'footer__logo')}>
            <img onClick={handleLogo} className={cx('logo')} src= {logo} alt="Logo" />
            </div>
            <div className={cx( 'footer__links')}>
              <ul className={cx( 'footer__list')}>
                <li className={cx( 'footer__item')}><a href="/">Trang chủ</a></li>
                <li className={cx( 'footer__item')}><a href="/services">Điều khoản</a></li>
                <li className={cx( 'footer__item')}><a href="#">Liên hệ</a></li>
              </ul>
            </div>
            <div className={cx( 'footer__social')}>
              <a href="https://www.facebook.com/profile.php?id=100007820205601"> <FaFacebookF/></a>
              <a href="https://twitter.com"><FaTwitch /></a>
              <a href="https://instagram.com"><FaInstagram /></a>
            </div>
          </div>
          <div className={cx( 'footer__bottom')}>
            <p>&copy; 2023 Company. All rights reserved.</p>
          </div>
        </footer>
        </div>
      );
}

export default Footer;