import styles from './DefaulayoutCompany.module.scss'
import classNames from "classnames/bind";
import SlidebarCompanyAdmin  from '../DefaultLayout/SlidebarCompanyAdmin'

const cx = classNames.bind(styles)
function DefaultLayout({children}) {
    return ( 
        <div>
            <div className="container">
            <SlidebarCompanyAdmin/>
                <div className={cx('content')}>
                    {children}
                </div>
            </div>
        </div>
     );
}

export default DefaultLayout;