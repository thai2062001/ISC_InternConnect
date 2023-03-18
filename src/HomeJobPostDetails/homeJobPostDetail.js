import classNames from "classnames/bind";
import styles from './homeJobPostDetail.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import { useParams,useNavigate  } from "react-router-dom";
import { FaLocationArrow, FaMoneyBillAlt, FaCalendarDay, FaHeart } from 'react-icons/fa';
import moment from 'moment';
import Popup from "reactjs-popup";
import ApplyCV from "./ApplyCV/ApplyCV";


const cx = classNames.bind(styles)
function HomeJobPostDetail() {
    const [showPopup, setShowPopup] = useState(false)
    const [jobPosts, setJobPost] = useState({})
    const [recommentPosts, setRecommentPosts] = useState([])
    const [student, setStudent] = useState({})
    const navigate = useNavigate();


    const { id } = useParams();
    const url = new URL(window.location.href);
    const idDetail = url.pathname.split('/').pop();
    const jobpost_token = localStorage.getItem('user-save');
    const decodeEmail = jwt_decode(jobpost_token);
    const emailUser = decodeEmail.email;
    const Username = decodeEmail.username;


    useEffect(() => {
        const studentApi = `http://localhost:5000/profile?email=${emailUser}`;
        const fetchData = async () => {
            const result = await fetch(studentApi, {
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
    }, [emailUser]);

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

    const CompanyName = jobPosts.namecompany


    //recomment jobpost
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
                const jobPostsOfCompany = json.filter(item => item.namecompany === CompanyName)
                if (jobPostsOfCompany.length > 0) {
                    setRecommentPosts(jobPostsOfCompany);
                } else {
                    console.error('Không có bài đăng nào của công ty này');
                }
            })
        }
        fetchData();
    }, [CompanyName]);


    const handleApply = () => {
        setShowPopup(true)
    }

    const handleRecommentPost = (id)=>{
        const path = `/${id}`
        console.log(id);
       navigate(path)
       window.location.href = path
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
                        <img src={jobPosts.logo} />
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
                        {jobPosts && student && (
                            <Popup open={showPopup} onClose={() => setShowPopup(false)}>
                                <ApplyCV
                                    expdate={jobPosts.expdate}
                                    username={Username}
                                    major={student.major}
                                    title={jobPosts.title}
                                    email={decodeEmail.email}
                                    company={jobPosts.namecompany}
                                    school={student.school}
                                    onClose={() => setShowPopup(false)}
                                />
                            </Popup>
                        )}

                        <div className={cx('apply_button')}>
                            <button onClick={handleApply}>Nộp đơn ngay</button>
                            <button className={cx('like_button')}><FaHeart style={{ marginTop: '7px' }} /></button>
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
                <ul>
                    {recommentPosts.map((recommentPost) => {
                        return (
                            <div key={recommentPost._id} onClick={()=>handleRecommentPost(recommentPost._id)} className={cx('recommentPost')}>
                                <div className={cx('jobpost')}>
                                    <div className={cx('logo_recomment')}>
                                        <img src={recommentPost.logo} />
                                    </div>
                                    <div className={cx('detail_post')}>
                                        <h2 className={cx('jobpost-title')}>{recommentPost.title}</h2>
                                        <div className={cx('jobpost-meta')}>
                                            <p className={cx('jobpost_company')}>{recommentPost.namecompany}</p>
                                            <p className={cx('jobpost_location')}>{recommentPost.location}</p>
                                            <p className={cx('jobpost_salary')}>{recommentPost.salary}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )
                    })}
                </ul>
            </div>

        </div>
    );
}

export default HomeJobPostDetail;