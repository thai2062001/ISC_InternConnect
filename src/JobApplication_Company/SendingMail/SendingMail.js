import classNames from "classnames/bind";
import styles from './SendingMail.module.scss'
import React, { useState,useEffect } from "react";


const cx = classNames.bind(styles)

function SendingMail(props) {
    const [toComEmail, setToComEmail] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [toEmail, setToEmail] = useState(props.initialEmail || '')
    const [toCompanyEmail, setToCompanyEmail] = useState(props.initialEmail || '')
    const [toId, setToId] = useState('')


    useEffect(() => {
        if (props.email && props.company_email) {
            setToEmail(props.email);
            setToComEmail(props.company_email)
            setToId(props.idSending)
        }
      }, [props.email]);

        const handleOnClose = () => {
            console.log('onClose is called');
            if (props.onClose) {
                props.onClose();
              }
        }
      console.log(toId);
        const handleFormSubmit = (event,toId) => {
            event.preventDefault();
          
            // Tạo payload gửi đi
            const payload = {
              to: toEmail,
              to_company: toComEmail,
              subject: subject,
              message: message
            };
          
            // Thực hiện gửi email
            fetch(`http://localhost:5000/company/list-cv/details/${toId}/send-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'

              },
              body: JSON.stringify(payload)
            })
            .then(response => response.json())
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
                <span className={cx('close')} onClick={handleOnClose}>
                    &times;
                </span>
                <form onSubmit={handleFormSubmit}>
                <label htmlFor="email">Email Gửi:</label>
                    <input type="email" id="to" value={toComEmail} onChange={e => setToComEmail(e.target.value)} />

                    <label htmlFor="email">Email nhận:</label>
                    <input type="email" id="to" value={toEmail} onChange={e => setToEmail(e.target.value)} />

                    <label htmlFor="subject">Chủ đề:</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={subject}
                        onChange={(event) => setSubject(event.target.value)}
                        required
                    />

                    <label htmlFor="message">Nội dung:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        required
                    ></textarea>

                    <button type="submit">Gửi</button>
                </form>
            </div>
        </div>
    );
}

export default SendingMail;