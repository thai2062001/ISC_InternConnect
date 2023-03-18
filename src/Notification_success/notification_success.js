import classNames from "classnames/bind";
import styles from './notification_success.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';

const cx = classNames.bind(styles)
function Notification_success({ message }) {

        return (
            <div className={cx('notification')}>
                {message}
            </div>
        );
    
}

export default Notification_success;