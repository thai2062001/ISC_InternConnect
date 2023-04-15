import classNames from "classnames/bind";
import styles from './SendingMailReport.module.scss'
import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
const cx = classNames.bind(styles)

function SendingMailReport(props) {
    const [toComEmail, setToComEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [fromAdminEmail, setFromAdminEmail] = useState(props.initialEmail || '')

    useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        setFromAdminEmail(decodeUser.email)
    }, [])
    useEffect(() => {
        if (props.title && props.emailCom) {
            setSubject(props.title);
            setToComEmail(props.emailCom)
            const mail = 'hptservices.group@gmail.com'

        }
    }, [props.emailCom]);

    const handleOnClose = () => {
        console.log('onClose is called');
        if (props.onClose) {
            props.onClose();
        }
    }
    const handleFormSubmit = (event) => {
        event.preventDefault();
        const token_submit = localStorage.getItem('user-save')
        // Tạo payload gửi đi
        const payload = {
            fromEmail: fromAdminEmail,
            toEmail: toComEmail,
            subject: subject,
            message: message
        };

        // Thực hiện gửi email
        fetch('http://localhost:5000/admin/report/send_mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token_submit}`
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                response.json()
                toast.success('Gửi mail thành công')
            }
            )

            .then(data => console.log(data))
            .catch(error => console.error(error));

        // Gọi onClose
        if (props.onClose) {
            props.onClose();
        }
    };


    return (
        <div className={cx('sending-mail')}>
            <div className={cx('sending-mail-content')}>
                <div className={cx('title')}>
                    <h1>Gửi mail phản hồi</h1>
                </div>
                <span className={cx('close')} onClick={handleOnClose}>
                    &times;
                </span>
                <ToastContainer/>
                <form className={cx('wrapper')} onSubmit={handleFormSubmit}>
                    <div className={cx('wrapper-content')}>
                        <label htmlFor="email">Email Gửi:</label>
                        <input required className={cx('input_email')} type="email" name="fromMail" id="fromMail" value={fromAdminEmail} onChange={e => setFromAdminEmail(e.target.value)} />
                    </div>
                    <div className={cx('wrapper-content')}>
                        <label htmlFor="email">Email nhận:</label>
                        <input required className={cx('input_email')} type="email" name="toMail" id="toMail" value={toComEmail} onChange={e => setToComEmail(e.target.value)} />
                    </div>

                    <div className={cx('wrapper-content')}>
                        <label htmlFor="subject">Chủ đề:</label>
                        <input classNames={cx('input_subject')}
                            type="text"
                            id="subject"
                            name="subject"
                            value={'[CẢNH CÁO]: ' + subject}
                            onChange={(event) => setSubject(event.target.value)}
                            required
                        />
                    </div>

                    <div className={cx('wrapper-content')}>
                        <label htmlFor="message">Nội dung:</label>
                        <textarea
                            id="message"
                            name="message"

                            onChange={(event) => setMessage(event.target.value)}
                            required
                        ></textarea>
                    </div>


                    <button type="submit">Gửi</button>
                </form>
            </div>
        </div>
    );
}

export default SendingMailReport;