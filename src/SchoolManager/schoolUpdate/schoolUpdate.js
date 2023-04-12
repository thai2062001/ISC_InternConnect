import classNames from "classnames/bind";
import styles from './schoolUpdate.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const cx = classNames.bind(styles)

function SchoolUpdate() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [website, setWebsite] = useState('')
    const [phone, setPhone] = useState('')
    const [location, setLocation] = useState('')
    const [accounts, setAccount] = useState([])
    const [cities, setCity] = useState([])
    const [isEditMode, setIsEditMode] = useState(false);


    const company_token = localStorage.getItem('user-save');
    const decodeEmail = jwt_decode(company_token);
    const EmailCompany = decodeEmail.email;
    const URL = 'http://localhost:5000/uni/profile'

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${company_token}`
                },
            });
            result.json().then(json => {
                setAccount(json);
                setName(json.profile.nameschool);
                setLocation(json.profile.location);
                setEmail(json.profile.emailschool);
                setWebsite(json.profile.websiteschool);
                setPhone(json.profile.phoneschool);
            });
        };
        fetchData();
    }, []);

    const handleChangeCity = (selectedOptions) => {
        setLocation(selectedOptions.value);
    };
    useEffect(() => {
        const apiLocation = 'http://localhost:5000/company/listareas'
        const fetchData = async () => {
            const result = await fetch(apiLocation, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${company_token}`
                },
            });
            result.json().then(json => {
                setCity(json);
            });
        };
        fetchData();
    }, []);

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleSubmit = () => {

        fetch('http://localhost:5000/uni/update-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${company_token}`
            },
            body: JSON.stringify({
                emailschool: email,
                nameschool: name,
                location:location,
                phoneschool: phone,
                websiteschool: website,
            })
        })
            .then(response => {
                toast.success('Đã cập nhật thông tin trường!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

            })
            .catch(error => {
                toast.error('Lỗi khi cập nhật thông tin công ty');
            });

    };

    return (
        <div className="App">
            <div className={cx('wrapper')}>
                <h1>Thiết lập thông tin Trường</h1>

                <div>
                    <div className={cx('form-group')}>
                        <label htmlFor="emailcompany" className={cx('label')}>Email Trường</label>
                        <input readOnly value={email} type="email" className={cx('input')} id="emailcompany" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={cx('form-group')}>
                        <label htmlFor="namecompany" className={cx('label')}>Tên Trường</label>
                        <input readOnly={!isEditMode} value={name} type="text" className={cx('input')} id="namecompany" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className={cx('form-group')}>
                        <label className={cx('label-place')}>Địa điểm</label>
                        <select id="location" className={cx('input')} value={location} onChange={(e) => setLocation(e.target.value)} >
                            <option value="">Chọn địa điểm</option>
                            {cities.map(city => (
                                <option key={city._id} value={city.name}>{city.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className={cx('form-group')}>
                        <label htmlFor="phonecompany" className={cx('label')}>Số điện thoại liên hệ</label>
                        <input readOnly={!isEditMode} value={phone} type="tel" className={cx('input')} id="phonecompany" onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className={cx('form-group')}>
                        <label htmlFor="websitecompany" className={cx('label')}>Website Trường</label>
                        <input readOnly={!isEditMode} value={website} type="url" className={cx('input')} id="websitecompany" onChange={(e) => setWebsite(e.target.value)} />
                    </div>

                </div>
                <ToastContainer />
                <div className={cx('btn_action')}>
                    <button
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={cx('btn-edit')}
                    >
                        {isEditMode ? 'Hủy' : 'Chỉnh sửa'}
                    </button>
                    <button type="submit" className={cx('btn')} onClick={handleSubmit}>Lưu thay đổi</button>

                </div>

                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            </div>


        </div>

    );
}

export default SchoolUpdate;