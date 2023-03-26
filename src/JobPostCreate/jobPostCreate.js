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
        const [name, setName] = useState('')
        const [logo, setLogo] = useState()
        const [selectedDate, setSelectedDate] = useState(null);
        const [skills, setSkills] = useState([]);
        const [checkedSkills, setCheckedSkills] = useState([]);


        const URLSkill = 'http://localhost:5000/company/list-skill'
        useEffect(() => {
            async function fetchSkills() {
                const response = await fetch(URLSkill);
                const data = await response.json();
                setSkills(data);
            }
            fetchSkills();
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
                formData.append('namecompany', document.getElementById('companyNameInput').value);
                formData.append('title', document.getElementById('jobTitleInput').value);
                formData.append('location', document.getElementById('locationInput').value);
                formData.append('salary', document.getElementById('salaryInput').value);
                formData.append('gender', document.getElementById('genderInput').value);
                formData.append('benefit', document.getElementById('benefitInput').value);
                formData.append('required', document.getElementById('requiredInput').value);
                formData.append('responsibility', document.getElementById('ResponInput').value);
                    formData.append('skill', checkedSkills.join(','));
                formData.append('expdate', selectedDate);
                formData.append('logo', logo);
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

        const handleSkillChange = (e) =>{
 const skill = e.target.value;
  const isChecked = e.target.checked;
  if (isChecked) {
    setCheckedSkills([...checkedSkills, skill]); // add the skill to the array
  } else {
    setCheckedSkills(checkedSkills.filter((s) => s !== skill)); // remove the skill from the array
  }
        }
        return (
            <div className={cx('wrapper')} >
                <h1 >Create a Jobpost</h1>
                <div className={cx('form-detail')}>
                    <div className={cx('container')}>
                        <div className={cx('logo-info')}>
                            {logo && <img src={logo.preview} alt="Logo preview" />}
                            <input className={cx('logo-input')} type="file"
                                onChange={handlePreviewLogo}
                            />
                            <h3>{accounts.namecompany}</h3>
                        </div>
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
                        <div >
                            <label className={cx('label-des-one')}>Địa chỉ</label>
                            <input id="locationInput" className={cx('input-des')} />
                        </div>
                        <div >
                            <label className={cx('label-des-one')}>Trợ cấp</label>
                            <input id="salaryInput" className={cx('input-des')} />
                        </div>
                    </div>
                    <div className={cx('wrapper-gen')}>
                        <div >
                            <label className={cx('label-des-one')} for="gender">Giới tính</label>
                            <select id="genderInput" name="gender">
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                    </div>
                    <div className={cx('wrapper-ip')}>
                        <label className={cx('label-des')} for="input-field">Phúc lợi thực tập</label>
                        <textarea id="benefitInput" className={cx('input-res')} />
                    </div>
                    <div className={cx('wrapper-ip')}>
                        <label className={cx('label-des')} for="input-field">Trách nhiệm </label>
                        <textarea id="ResponInput" className={cx('input-res')} />
                    </div>
                    <div className={cx('wrapper-ip')}>
                        <label className={cx('label-des')} for="input-field">Yêu cầu</label>
                        <textarea id="requiredInput" type="text" className={cx('input-res')} />
                    </div>
                    <div className={cx('wrapper-ip')}>
                    <label className={cx('label-des')} htmlFor="skillinput">Kỹ năng</label>
                        <div className={cx('checkbox_wrapper')}>
                        {skills.map(skill => (
                            <div className={cx('input_wrapper_checkbox')} key={skill.id}>
                                <input type="checkbox" id={`skill-${skill._id}`} name="skills" value={skill.nameskill} onChange={handleSkillChange} />
                                <label htmlFor={`skill-${skill._id}`}>{skill.nameskill}</label>
                            </div>
                        ))}
                        </div>
                    </div>
                    <div className={cx('button-action-div')}>
                        <button className={cx('button-action')} onClick={createJobPost}>Đăng bài</button>
                    </div>
                </div>
            </div>
        );
    }

    export default JobPostCreate;