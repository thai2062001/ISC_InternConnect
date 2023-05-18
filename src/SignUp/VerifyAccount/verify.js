
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Verify.module.scss";
const cx = classNames.bind(styles);


function VerifyAccount() {
    const [mail,setMail]= useState({})
    const { id } = useParams();


    const url = new URL(window.location.href);
    const email = url.pathname.split('/').pop();

        const api = `http://localhost:5000/auth/signup/${email}`
        useEffect(() => {
            const fetchData = async () => {
                const result = await fetch(api, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                result.json().then(json => {
                    setMail(json)
                })
            }
            fetchData();
        }, []);
    return ( 
    <div className={cx('verify-wrapper')} >
        <h1>Xác thực Email thành công</h1>
        <h1>Vui lòng bấm vào <a href="http://localhost:3000/login">đây</a> để quay lại trang đăng nhập </h1>
        <img width="480" height="480" src="https://img.icons8.com/officel/480/checked--v1.png" alt="checked--v1"/>
    </div> );
}

export default VerifyAccount;