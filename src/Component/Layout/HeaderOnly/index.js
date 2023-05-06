import Header from "../components/Header";
import Footer from "../DefaultLayout/Footer/Footer";
import classNames from 'classnames/bind';
import styles from '../DefaultLayout/DefaultLayout.module.scss'

const cx = classNames.bind(styles)
function DefaultLayout({children}) {
    return ( 
        <div>
            <Header />
            <div className="container">
                <div className="content">
                    {children}
                </div>
            </div>
            <Footer className={cx('footer')}/>
        </div>
     );
}

export default DefaultLayout;