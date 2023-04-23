import classNames from "classnames/bind";
import styles from './introduceCompany.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'


const cx = classNames.bind(styles)

function IntroduceCompany() {
    const [name, setName] = useState('');
    const [logo, setLogo] = useState()
    const [companyLogo, setCompanyLogo] = useState()
    const [email, setEmail] = useState('');
    const [location, setLocation] = useState('');
    const [place, setPlace] = useState('');
    const [website, setWebsite] = useState('');
    const [phone, setPhone] = useState('');
    const [introduce, setIntroduce] = useState('');
    const [slogan, setSlogan] = useState('');

    const [accounts, setAccount] = useState([])
    const [cities, setCity] = useState([])
    const [selectedValueCities, setSelectedValueCities] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    const company_token = localStorage.getItem('user-save');
    const decodeEmail = jwt_decode(company_token);
    const EmailCompany = decodeEmail.email;
    const apiUrl = 'http://localhost:5000/company/profile'

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${company_token}`
                },
            });
            result.json().then(json => {
                setAccount(json);
                setCompanyLogo(json.profile[0].logo);
                setName(json.profile[0].namecompany);
                setEmail(json.profile[0].emailcompany);
                setWebsite(json.profile[0].websitecompany);
                setLocation(json.profile[0].location);
                setPlace(json.profile[0].place);
                setPhone(json.profile[0].phonecompany);
                setIntroduce(json.profile[0].introduce);
                setSlogan(json.profile[0].slogan);
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
        document.getElementById('placeInput').disabled = true;
        setIsEditMode(true);

    };
    useEffect(() => {
        return () => {
            logo && URL.revokeObjectURL(logo.preview)
            // logo && : nếu ko có logo để khởi tạo thì chạy cái thứ 2. Nếu đã có logo thì xóa đi để tránh rò rỉ
            //Dùng để xóa bỏ url preview ảnh ra khỏi bộ nhớ để tránh rò rỉ bộ nhớ
        }
    }, [logo])

    const handlePreviewLogo = (e) => {
        const logo = e.target.files[0]
        logo.preview = URL.createObjectURL(logo)
        setLogo(logo)
        //URL.createObjectURL dùng để tạo Obj để trở thành 1 url để có thể xem tạm ảnh
    }
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
                location: location,
                websitecompany: website,
                introduce: introduce,
                place:place,
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
                window.location.reload();
            })
            .catch(error => {
                toast.error('Lỗi khi cập nhật thông tin công ty');
            });
    };


    const handleUploadLogo = async () => {
        try {
            const formData = new FormData();
            formData.append('logo', logo);
            const response = await fetch('http://localhost:5000/company/profile/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${company_token}`
                },
            });
            if (!response.ok) {
                throw new Error(response.status);
            }
            const data = await response.json();
            console.log(data);
            window.location.reload();
            toast.success('Đã cập nhật Logo thành công!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="App">
            <div className={cx('wrapper')}>
                <h1>Profile</h1>

                {accounts && accounts.profile && accounts.profile.length > 0 && (
                    <div>
                        <div className={cx('form-group', 'logo_com')}>
                            {companyLogo ? (
                                <div>
                                    <img src={companyLogo} className={cx('logo_img-old')} id="imagePreview" alt="Logo preview" />
                                    {logo &&
                                        <img src={logo.preview} className={cx('logo_img-new')} id="imagePreview" alt="Logo preview" />
                                    }
                                    <input id='imageInput' className={cx('logo-input')} type="file" onChange={handlePreviewLogo} />
                                    <button className={cx('upload_button')} onClick={handleUploadLogo}>Lưu ảnh</button>
                                </div>
                            ) : (
                                <>
                                    <input id='imageInput' className={cx('logo-input')} type="file" onChange={handlePreviewLogo} />
                                    {logo && <img src={logo.preview} className={cx('logo_img-new')} id="imagePreview" alt="Logo preview" />}
                                    <button className={cx('upload_button')} onClick={handleUploadLogo}>Lưu ảnh</button>
                                </>
                            )}
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="emailcompany" className={cx('label')}>Email</label>
                            <input readOnly value={email} type="email" className={cx('input')} id="emailcompany" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className={cx('select-wrapper')}>
                            <label className={cx('label-place')}>Địa điểm</label>
                            <select id="placeInput" className={cx('input')} value={location} onChange={(e) => setLocation(e.target.value)} >
                                <option value="">Chọn Địa điểm</option>
                                {cities.map(city => (
                                    <option key={city._id} value={city.name}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="phonecompany" className={cx('label')}>Địa chỉ</label>
                            <input readOnly={!isEditMode} value={place} type="tel" className={cx('input')} id="placecompany" onChange={(e) => setPlace(e.target.value)} />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="phonecompany" className={cx('label')}>Số điện thoại</label>
                            <input readOnly={!isEditMode} value={phone} type="tel" className={cx('input')} id="phonecompany" onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="websitecompany" className={cx('label')}>Website </label>
                            <input readOnly={!isEditMode} value={website} type="url" className={cx('input')} id="websitecompany" onChange={(e) => setWebsite(e.target.value)} />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="introduce" className={cx('label')}>Lời giới thiệu</label>
                            <textarea readOnly={!isEditMode} value={introduce} className={cx('textarea')} id="introduce" onChange={(e) => setIntroduce(e.target.value)} />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="slogan" className={cx('label')}>Slogan</label>
                            <textarea readOnly={!isEditMode} value={slogan} className={cx('textarea','slogan')} id="slogan" onChange={(e) => setSlogan(e.target.value)} />
                        </div>
                    </div>
                )}
                <ToastContainer style={{ width: '350px' }} />
                <div className={cx('btn_action')}>
                    <button
                        onClick={() => setIsEditMode(!isEditMode)}
                        className={cx('btn-edit')}
                    >
                        {isEditMode ? 'Hủy bỏ' : 'Chỉnh sửa'}
                    </button>
                    <button type="submit" className={cx('btn')} onClick={handleSubmit}>Lưu thay đổi</button>

                </div>

                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            </div>


        </div>

    );
}

export default IntroduceCompany;