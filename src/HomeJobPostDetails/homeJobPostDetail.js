import classNames from "classnames/bind";
import styles from './homeJobPostDetail.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import { useParams } from "react-router-dom";
import { FaLocationArrow, FaMoneyBillAlt, FaCalendarDay } from 'react-icons/fa';
import moment from 'moment';
import Popup from "reactjs-popup";
import ApplyCV from "./ApplyCV/ApplyCV";

const cx = classNames.bind(styles)
function HomeJobPostDetail() {
    const [showPopup, setShowPopup] = useState(false)
    const [jobPosts, setJobPost] = useState({})
    const [student, setStudent] = useState({})
    const [expdate, setExpdate] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [major, setMajor] = useState('')
    const [school, setSchool] = useState('')
    const [company, setCompany] = useState('')
    const [title, setTitle] = useState('')

    const { id } = useParams();
    const url = new URL(window.location.href);
    const idDetail = url.pathname.split('/').pop();
    const jobpost_token = localStorage.getItem('user-save');
    const decodeEmail = jwt_decode(jobpost_token);
    const emailUser = decodeEmail.email;
    const Username = decodeEmail.username;

    useEffect(() => {
        const jobpostApi = `http://localhost:5000/profile?email=${emailUser}`;
        const fetchData = async () => {
            const result = await fetch(jobpostApi, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jobpost_token}`
                },
            });
            result.json().then(json => {
                setStudent(json.profile[0]);
            });
        };
        fetchData();
    }, [email]);
    
    useEffect(() => {
        const jobpostApi = 'http://localhost:5000/'
        const fetchData = async () => {
            const result = await fetch(jobpostApi, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jobpost_token}`
                },
            })
            result.json().then(json => {
                const jobpost = json.find(item => item._id === idDetail);
                if (jobpost) {
                    setJobPost(jobpost);
                } else {
                    console.error('Không tồn tại bài đăng có id này');
                }
            })
        }
        fetchData();
    }, []);


    useEffect(() => {
        setExpdate(jobPosts.expdate);
        setUsername(Username);
        setEmail(emailUser);
        setCompany(jobPosts.namecompany);
        setMajor(student.major);
        setSchool(student.school);
        setTitle(jobPosts.title)
    }, [jobPosts.expdate, Username, emailUser, jobPosts.namecompany, student.major, student.school,jobPosts.title]);

    // console.log('HomeJob');
    // console.log('1', expdate);
    // console.log('2', username);
    // console.log('3', email);
    // console.log('4', company);
    // console.log('5', major);
    // console.log('6', school);

    const handleApply = () => {
        setShowPopup(true)
    }

    const date_string = jobPosts.expdate;
    const date = moment(date_string);
    const formatted_date = date.format('DD/MM/YYYY');
    return (
        <div className={cx('Jobpost-wapper')}>
            <div className={cx('jobpost-detail')}>
                <div className={cx('banner')}>
                    <img src="https://dxwd4tssreb4w.cloudfront.net/web/images/default_banner_2.svg" />
                </div>
                <div className={cx('jobpost-decription')}>
                    <div className={cx('jobpost-logo')}>
                        <img src="https://thanhtra.com.vn/data/images/0/2021/01/07/congdinh/logo-moi-cua-viettel.jpg?dpi=150&quality=100&w=630&mode=crop&anchor=topcenter&scale=both" />
                        <div className={cx('company-title')}>
                            <div><h1>{jobPosts.title}</h1></div>
                            <div><span>{jobPosts.namecompany}</span></div>
                        </div>
                    </div>

                    <div className={cx('jobpost-location-salary-exdate')}>
                        <div className={cx('jobpost-location')}>
                            <FaLocationArrow className={cx('icon-d1', 'location_icon')} />
                            {jobPosts.location}
                        </div>

                        <div className={cx('jobpost-salary')}>
                            <FaMoneyBillAlt className={cx('icon-d1')} />
                            {jobPosts.salary}
                        </div>
                        <div className={cx('jobpost-exdate')}>
                            <FaCalendarDay className={cx('icon-d1')} />
                            {formatted_date}
                        </div>
                        {expdate &&username && major &&email &&company && school&& title &&(
                            <Popup open={showPopup} onClose={() => setShowPopup(false)}>
                                <ApplyCV
                                    expdate={expdate}
                                    username={username}
                                    major={major}
                                    title={title}
                                    email={email}
                                    company={company}
                                    school={school}
                                    onClose={() => setShowPopup(false)}
                                />
                            </Popup>
                        )}

                        <div className={cx('apply_button')}>
                            <button onClick={handleApply}>Nộp đơn ngay</button>
                        </div>

                        <div className={cx('div-nav-des')}>
                            <span>Yêu cầu</span>
                            <span>Trách nhiệm </span>
                            <span>Kỹ năng</span>
                            <span>Phúc lợi</span>
                        </div>
                        <div className={cx('content')}>
                            <div className={cx('required')}>
                                <span className={cx('span-title')}>Yêu cầu</span>
                                <p>{jobPosts.required}</p>
                            </div>

                            <div className={cx('responsibility')}>
                                <span className={cx('span-title')}>Trách nhiệm</span>
                                <p>{jobPosts.responsibility}</p>
                            </div>

                            <div className={cx('skill')}>
                                <span className={cx('span-title')}>Kỹ năng</span>
                                <p>{jobPosts.skill}</p>
                            </div>

                            <div className={cx('benefit')}>
                                <span className={cx('span-title')}>Phúc lợi</span>
                                <p>{jobPosts.benefit}</p>
                            </div>

                        </div>
                    </div>
                    <div>

                    </div>
                </div>

            </div>
            <div className={cx('jobpost-recomment')}>
            </div>

        </div>
    );
}

export default HomeJobPostDetail;