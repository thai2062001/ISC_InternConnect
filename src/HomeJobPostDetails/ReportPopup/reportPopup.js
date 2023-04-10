import classNames from "classnames/bind";
import styles from "./reportPopup.module.scss";
import React, { useState, useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);

function ReportPopup(props) {
    const [email, setEmail] = useState("");
    const [emailcom, setEmailCom] = useState("");
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

        const localstore = localStorage.getItem('user')
        const decodeUser = jwt_decode(localstore);
        console.log(decodeUser.email);

    useEffect(() => {
        setEmail(decodeUser.email);
        setEmailCom(props.companyEmail)
        setTitle(props.title)
    }, []);




    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    }
    const handleChecked = (event) => {
        setContent(event.target.value);
    }
    async function handleSubmit(event) {
        event.preventDefault();
        const token_student = localStorage.getItem('user')
        const apiReport = 'http://localhost:5000/report';
        try {
            const response = await fetch(apiReport, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token_student}`,
                },
                body: JSON.stringify({ email,content, emailcom, title  })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            toast.success('Báo cáo thành công!');
            return result;

        } catch (error) {
            console.error('Error:', error);
            throw new Error('There was a problem submitting the report');
        }

    }
    const handleOnClose = () => {
        if (props.onClose) {
            props.onClose();
        }
    };


    return (
        <div className={cx('wrapper-popup-report')}>
            <h2>Report bài đăng</h2>
            <span className={cx("close")} onClick={handleOnClose}>
                &times;
            </span>
            <ToastContainer />
            <form onSubmit={(event) => handleSubmit(event)}>
                <div className={cx('form-group')}>
                    <label className={cx('label-content')} htmlFor="email">Email của bạn</label>
                    <input type="email" id="email" name="email" className={cx('form-control')} value={email} onChange={handleEmailChange} required />
                </div>
                <div className={cx('form-group')}>
                    <label className={cx('label-content')} htmlFor="title">Title bài đăng</label>
                    <input type="text" id="title" name="title" className={cx('form-control')} value={title} onChange={handleTitleChange} required />
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="reason">Lý do report</label>
                    <div className={cx('form-check')}>
                        <input type="radio" id="reason-spam" name="reason" value="Lừa đảo" className={cx('form-check-input')} onChange={handleChecked} required />
                        <label htmlFor="reason-spam" className={cx('form-check-label')}>Lừa đảo</label>
                    </div>
                    <div className={cx('form-check')}>
                        <input type="radio" id="reason-violation" name="reason" value="Vi phạm chính sách" className={cx('form-check-input')} onChange={handleChecked} required />
                        <label htmlFor="reason-violation" className={cx('form-check-label')}>Vi phạm chính sách</label>
                    </div>
                    <div className={cx('form-check')}>
                        <input type="radio" id="reason-inappropriate" name="reason" value="Khác" className={cx('form-check-input')} onChange={handleChecked} required />
                        <label htmlFor="reason-inappropriate" className={cx('form-check-label')}>Khác</label>
                    </div>
                </div>
                <button type="submit" className={cx('btn', 'btn-primary')}>Gửi report</button>
            </form>
        </div>
    );
};

export default ReportPopup;