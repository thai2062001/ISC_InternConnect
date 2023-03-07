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

    const sub = "Thư mời làm việc"
    const Mess = "Lời đầu tiên, chúng tôi vô cùng cảm ơn vì bạn đã quan tâm và dành thời gian ứng tuyển vị trí Thực tập IT Developer tại công ty chúng tôi. Thông qua buổi phỏng vấn cũng như trao đổi, chúng tôi đánh giá cao kinh nghiệm và kỹ năng của bạn.Bởi vậy, chúng tôi xin trân trọng mời bạn gia nhập vào đội ngũ công ty AITECH ASIA, với vị trí Thực tập IT Developer . Bạn vui lòng bắt đầu đến nhận việc vào 01/04/2023, từ 9:00, tại 45 đường 3/2 phường 11, quận 10, HCM.Khi nhận được Email này, bạn vui lòng xác nhận lại cho chúng tôi trước 27/03/2023. Nếu có bất cứ thắc mắc nào, bạn hãy liên hệ với chúng tôi qua thuctap@aitechasia.vn.Chúng tôi rất mong đợi được đón tiếp bạn như một thành viên của đội ngũ. Xin chân thành cảm ơn bạn!"
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
        const handleFormSubmit = (event,toId) => {
            event.preventDefault();
            // Tạo payload gửi đi
            const payload = {
              fromMail: toComEmail,
              toMail: toEmail,
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
                    <input type="email" name="fromMail" id="fromMail" value={toComEmail} onChange={e => setToComEmail(e.target.value)} />

                    <label htmlFor="email">Email nhận:</label>
                    <input type="email" name="toMail" id="toMail" value={toEmail} onChange={e => setToEmail(e.target.value)} />

                    <label htmlFor="subject">Chủ đề:</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={sub}
                        onChange={(event) => setSubject(event.target.value)}
                        required
                    />

                    <label htmlFor="message">Nội dung:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={Mess}
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