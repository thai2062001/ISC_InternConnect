import classNames from "classnames/bind";
import styles from './HomeAdmin.module.scss'

const cx = classNames.bind(styles)

function HomeAdmin() {
    return ( 
        <div className={cx('wrapper')}>
            <h1>HomeAdmin_page</h1>
        </div>
     );
}

export default HomeAdmin;