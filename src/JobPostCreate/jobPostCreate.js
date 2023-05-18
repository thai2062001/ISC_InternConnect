
import classNames from "classnames/bind";
import styles from './jobPostCreate.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select'

const cx = classNames.bind(styles)
function JobPostCreate() {
    const [accounts, setAccount] = useState({})
    const [name, setName] = useState('')
    const [logo, setLogo] = useState()
    const [selectedDate, setSelectedDate] = useState(null);
    const [listmajor, setListMajor] = useState([])
    const [selectedMajor, setSelectedMajor] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedValueCities, setSelectedValueCities] = useState('');
    const [companyLogo, setCompanyLogo] = useState()



    useEffect(() => {
        const apiLogoCompany = 'http://localhost:5000/company/profile'
        const fetchData = async () => {
            const result = await fetch(apiLogoCompany, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${company_token}`
                },
            });
            result.json().then(json => {
                setCompanyLogo(json.profile[0].logo);
            });
        };
        fetchData();
    }, []);


    const cityapi = 'http://localhost:5000/company/listareas'
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(cityapi, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            result.json().then(json => {
                setCities(json);
            });
        };
        fetchData();
    }, []);
    const apiUrl = 'http://localhost:5000/company/listmajor'
    const company_token = localStorage.getItem('user-save');
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
                setListMajor(json);
            });
        };
        fetchData();
    }, []);


    useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        setName(decodeUser.username)
    }, [])

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
        const logo = e.target.files[0]
        logo.preview = URL.createObjectURL(logo)
        setLogo(logo)
        //URL.createObjectURL dùng để tạo Obj để trở thành 1 url để có thể xem tạm ảnh
    }

    const createJobPost = async () => {
        try {
            const formData = new FormData();
            if (companyLogo) {
                formData.append('namecompany', document.getElementById('companyNameInput').value);
                formData.append('title', document.getElementById('jobTitleInput').value);
                formData.append('workingform', document.getElementById('wokingformInput').value);
                formData.append('location', document.getElementById('locationInput').value);
                formData.append('salary', document.getElementById('salaryInput').value);
                formData.append('gender', document.getElementById('genderInput').value);
                formData.append('benefit', document.getElementById('benefitInput').value);
                formData.append('required', document.getElementById('requiredInput').value);
                formData.append('responsibility', document.getElementById('ResponInput').value);
                formData.append('expdate', selectedDate);
                formData.append('major', selectedMajor);
                formData.append('place', selectedValueCities);
                formData.append('logo', companyLogo);
            } else {
                formData.append('namecompany', document.getElementById('companyNameInput').value);
                formData.append('title', document.getElementById('jobTitleInput').value);
                formData.append('workingform', document.getElementById('wokingformInput').value);
                formData.append('location', document.getElementById('locationInput').value);
                formData.append('salary', document.getElementById('salaryInput').value);
                formData.append('gender', document.getElementById('genderInput').value);
                formData.append('benefit', document.getElementById('benefitInput').value);
                formData.append('required', document.getElementById('requiredInput').value);
                formData.append('responsibility', document.getElementById('ResponInput').value);
                formData.append('expdate', selectedDate);
                formData.append('major', selectedMajor);
                formData.append('place', selectedValueCities);
                formData.append('logo', logo);
            }
            const response = await fetch('http://localhost:5000/company/create', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error(response.status);
            }
            const data = await response.json();
            console.log(data);
            window.location.href = "/companyadmin"
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeCity = (selectedOptions) => {
        setSelectedValueCities(selectedOptions.value);
    };
    const handleGoBack = () => {
        window.history.back();
      };

    return (
        <div className={cx('wrapper')} >
            <div className={cx('back-wrapper')} >
                <img width="24" height="24" src="https://img.icons8.com/material-rounded/24/back--v1.png" alt="back--v1" />
                <span className={cx('goback-btn')} onClick={handleGoBack}>Quay lại</span>
            </div>
            <h1 >Tạo bài đăng mới</h1>
            <div className={cx('form-detail')}>
                <div className={cx('container')}>
                    <div className={cx('logo-info')}>
                        {companyLogo ? (<img src={companyLogo} alt="Logo preview" />) : (
                            <div>
                                {logo && <img src={logo.preview} alt="Logo preview" />}
                                <input className={cx('logo-input')} type="file" onChange={handlePreviewLogo} />
                            </div>

                        )}
                        {/*  */}


                        <h3>{accounts.namecompany}</h3>
                    </div>

                </div>
                <div className={cx('wrapper-date-form')}>
                    <div className={cx('input-img')}>
                        <label className={cx('label')} style={{ marginRight: '10px' }}>Date</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Chọn ngày hết hạn"
                            className={cx('datepicker')}
                        />
                    </div>
                    <div className={cx('working_form-wrapper')} >
                        <label className={cx('label-des')} for="workingform">Hình thức</label>
                        <select id="wokingformInput" name="workingform"> classNames={cx('workingForm')}
                            <option value="Bán thời gian">Bán thời gian</option>
                            <option value="Toàn thời gian">Toàn thời gian</option>

                        </select>
                    </div>


                </div>
            </div>
            <div className={cx('title_wrap')}>
                <label className={cx('label-des')}>Tên công ty</label>
                <input id="companyNameInput" disabled value={name} className={cx('input-title')} />
            </div>

            <div className={cx('title_wrap')}>
                <label className={cx('label-des')}>Tiêu đề</label>
                <input id="jobTitleInput" className={cx('input-title')} />
            </div>

            <div className={cx('wrapper-des')}>
                <div className={cx('select-wrapper')}>
                    <label className={cx('label-place')}>Khu vực</label>
                    <Select className={cx('select')}
                        placeholder='Chọn thành phố'
                        options={cities.map(city => ({ label: city.name, value: city.name }))}
                        onChange={handleChangeCity}
                    />
                </div>
                <div className={cx('gender-wrapper')}>
                    <label className={cx('label-des')} for="gender">Trợ cấp</label>
                    <select id="salaryInput" name="gender" className={cx('gender-input')}>
                        <option value="0-3Tr VND">0-2Tr VND</option>
                        <option value="1Tr-3Tr VND">1Tr-3Tr VND</option>
                        <option value="2Tr-4Tr VND">2Tr-4Tr VND</option>
                        <option value="4Tr-6Tr VND">4Tr-6Tr VND</option>
                        <option value="6Tr-10Tr VND">6Tr-10Tr VND</option>
                        <option value="Thương lượng">Thương lượng</option>
                        <option value="Cạnh tranh">Cạnh tranh</option>
                    </select>
                </div>
            </div>
            <div>
                <div className={cx('detail-location')}>
                    <label className={cx('label-des')}>Địa chỉ chi tiết</label>
                    <input id="locationInput" className={cx('input-location')} />
                </div>
            </div>
            <div className={cx('wrapper-gen')}>
                <div className={cx('gender-wrapper')}>
                    <label className={cx('label-des')} for="gender">Giới tính</label>
                    <select id="genderInput" name="gender" className={cx('gender-input')}>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Không yêu cầu">Không yêu cầu</option>
                    </select>
                </div>

                <div className={cx('major-wrapper')}>
                    <label className={cx('label-des')}>Ngành nghề</label>
                    <select id="majorInput" className={cx('major-input')} value={selectedMajor} onChange={e => setSelectedMajor(e.target.value)}>
                        <option value="">Chọn ngành nghề</option>
                        {listmajor.map(major => (
                            <option key={major._id} value={major.namemajor}>{major.namemajor}</option>
                        ))}
                    </select>
                </div>

            </div>
            <div className={cx('wrapper-ip')}>
                <label className={cx('label-des')} for="input-field">Phúc lợi thực tập</label>
                <textarea id="benefitInput" className={cx('input-res')} />
            </div>
            <div className={cx('wrapper-ip')}>
                <label className={cx('label-des')} for="input-field">Mô tả công việc </label>
                <textarea id="ResponInput" className={cx('input-res')} />
            </div>
            <div className={cx('wrapper-ip')}>
                <label className={cx('label-des')} for="input-field">Yêu cầu</label>
                <textarea id="requiredInput" type="text" className={cx('input-res')} />
            </div>
            <div className={cx('button-action-div')}>
                <button className={cx('button-action')} onClick={createJobPost}>Đăng bài</button>
            </div>
        </div>

    );
}

export default JobPostCreate;