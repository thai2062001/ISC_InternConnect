import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from './jobPostCreate.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import SlidebarCompany from '../Component/Layout/SlidebarCompany'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const cx = classNames.bind(styles)
function JobPostCreate() {
    const [accounts, setAccount] = useState({})
    const [logo, setLogo] = useState()
    const [image, setImage] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        return () => {
            logo && URL.revokeObjectURL(logo.preview)
            // logo && : nếu ko có logo để khởi tạo thì chạy cái thứ 2. Nếu đã có logo thì xóa đi để tránh rò rỉ
            //Dùng để xóa bỏ url preview ảnh ra khỏi bộ nhớ để tránh rò rỉ bộ nhớ
        }
    }, [logo])

    const handlePreviewLogo = (e) => {
        const file = e.target.files[0]
        file.preview = URL.createObjectURL(file)
        //URL.createObjectURL dùng để tạo Obj để trở thành 1 url để có thể xem tạm ảnh
        setLogo(file)
    }

    return (
        <div className={cx('wrapper')} >
            <h1 >Create a Jobpost</h1>

            <div className={cx('form-detail')}>
                <div className={cx('container')}>
                    <div className={cx('logo-info')}>
                        <img src={accounts.url} />
                        <h3>{accounts.namecompany}</h3>
                    </div>

                    <div className={cx('input-img')}>
                        <label style={{ marginRight: '10px' }}>Date</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Chọn ngày hết hạn"
                        />
                    </div>
                </div>

                <div className={cx('title_wrap')}>
                    <label className={cx('label-des')}>Tên công ty</label>
                    <input className={cx('input-title')} />
                </div>

                <div className={cx('title_wrap')}>
                    <label className={cx('label-des')}>Tiêu đề</label>
                    <input className={cx('input-title')} />
                </div>

                <div className={cx('wrapper-des')}>
                    <div >
                        <label className={cx('label-des-one')}>Địa chỉ</label>
                        <input className={cx('input-des')} />
                    </div>
                    <div >
                        <label className={cx('label-des-one')}>Trợ cấp</label>
                        <input className={cx('input-des')} />
                    </div>
                </div>
                <div className={cx('wrapper-gen')}>
                    <div >
                        <label className={cx('label-des-one')}>Khác</label>
                        <input className={cx('input-des')} />
                    </div>
                    <div >
                        <label className={cx('label-des-one')} for="gender">Giới tính</label>
                        <select id="gender" name="gender">
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                </div>


                <div className={cx('wrapper-ip')}>
                    <label className={cx('label-des')} for="input-field">Phúc lợi thực tập</label>
                    <input className={cx('input-res')} />
                </div>
                <div className={cx('wrapper-ip')}>
                    <label className={cx('label-des')} for="input-field">Trách nhiệm </label>
                    <input className={cx('input-res')} />
                </div>
                <div className={cx('wrapper-ip')}>
                    <label className={cx('label-des')} for="input-field">Kỹ năng</label>
                    <input type="text" className={cx('input-res')} />
                </div>
            </div>

        </div>
    );
}


export default JobPostCreate;