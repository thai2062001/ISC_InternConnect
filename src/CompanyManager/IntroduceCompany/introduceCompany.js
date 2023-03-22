import classNames from "classnames/bind";
import styles from './introduceCompany.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const cx = classNames.bind(styles)

function IntroduceCompany() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('')
    const [website, setWebsite] = useState('')
    const [phone, setPhone] = useState('')
    const [introduce, setIntroduce] = useState('')
    const [slogan, setSlogan] = useState('')
    const [accounts, setAccount] = useState([])
    const [isEditMode, setIsEditMode] = useState(false);


    const company_token = localStorage.getItem('user-save');
    const decodeEmail = jwt_decode(company_token);
    const EmailCompany = decodeEmail.email;
    const URL = 'http://localhost:5000/company/profile'

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
                setName(json.profile[0].namecompany);
                setEmail(json.profile[0].emailcompany);
                setWebsite(json.profile[0].websitecompany);
                setPhone(json.profile[0].phonecompany);
                setIntroduce(json.profile[0].introduce);
                setSlogan(json.profile[0].slogan);
            });
        };
        fetchData();
    }, []);

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleSubmit = () => {

        fetch('http://localhost:5000/company/update-profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${company_token}`
            },
            body: JSON.stringify({
                emailcompany: email,
                namecompany: name,
                phonecompany: phone,
                websitecompany: website,
                introduce: introduce,
                slogan: slogan
            })
        })
            .then(response => {
                toast.success('Đã cập nhật thông tin công ty!', {
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
           
            {accounts && accounts.profile && accounts.profile.length > 0 && (
                <div>
                    <div className={cx('form-group')}>
                        <label htmlFor="emailcompany" className={cx('label')}>Email Company</label>
                        <input readOnly={!isEditMode} value={email} type="email" className={cx('input')} id="emailcompany" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className={cx('form-group')}>
                        <label htmlFor="namecompany" className={cx('label')}>Name Company</label>
                        <input readOnly={!isEditMode} value={name} type="text" className={cx('input')} id="namecompany" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className={cx('form-group')}>
                        <label htmlFor="phonecompany" className={cx('label')}>Phone Company</label>
                        <input readOnly={!isEditMode} value={phone} type="tel" className={cx('input')} id="phonecompany" onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className={cx('form-group')}>
                        <label htmlFor="websitecompany" className={cx('label')}>Website Company</label>
                        <input readOnly={!isEditMode} value={website} type="url" className={cx('input')} id="websitecompany" onChange={(e) => setWebsite(e.target.value)} />
                    </div>
                    <div className={cx('form-group')}>
                        <label htmlFor="introduce" className={cx('label')}>Introduce</label>
                        <textarea  readOnly={!isEditMode} value={introduce} className={cx('textarea')} id="introduce" onChange={(e) => setIntroduce(e.target.value)} />
                    </div>
                    <div className={cx('form-group')}>
                        <label htmlFor="slogan" className={cx('label')}>Slogan</label>
                        <textarea readOnly={!isEditMode} value={slogan} className={cx('textarea')} id="slogan" onChange={(e) => setSlogan(e.target.value)} />
                    </div>
                </div>
            )}
            <ToastContainer/>
            <div className={cx('btn_action')}>
            <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={cx('btn-edit')}
            >
                {isEditMode ? 'Cancel' : 'Edit'}
            </button>
            <button type="submit" className={cx('btn')} onClick={handleSubmit}>Submit</button>

            </div>

            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
             </div>


        </div>

    );
}

export default IntroduceCompany;