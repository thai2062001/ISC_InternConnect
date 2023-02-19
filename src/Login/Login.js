import classNames from 'classnames/bind';
import styles from './Login.module.scss'


const cx = classNames.bind(styles)

function Login() {
    return ( 
        <div className={cx('wrapper')}>
        <div>
            <input className={cx('user-input')}
              name="username"
              placeholder="username" 
            />
          </div>
          <div>
            <input className={cx('password-input')}
              name="password"
              placeholder="password" 
            />
          </div>
          <button >submit</button>
        
      </div>
     );
}

export default Login;