import classNames from "classnames/bind";
import styles from './detailCompany.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import { useParams, useNavigate } from "react-router-dom";
import { FaLocationArrow, FaMoneyBillAlt, FaCalendarDay, FaHeart } from 'react-icons/fa';
import moment from 'moment';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const cx = classNames.bind(styles)
function DetailCompany() {

    const [jobPosts, setJobPost] = useState({})
    const [recommentPosts, setRecommentPosts] = useState([])
    const [student, setStudent] = useState({})
    const [company, setCompany] = useState({})
    const [hasUserData, setHasUserData] = useState(!!localStorage.getItem('user'));
    const [data, setData] = useState({});


    const navigate = useNavigate();
    const { id } = useParams();
    const url = new URL(window.location.href);
    const idDetail = url.pathname.split('/').pop();
    const favorite = url.pathname.split('/').pop();
    const jobpost_token = localStorage.getItem('user');
    const decodeEmail = jobpost_token ? jwt_decode(jobpost_token) : null;
    const emailUser = decodeEmail ? decodeEmail.email : null;
    const Username = decodeEmail ? decodeEmail.username : null;

    useEffect(() => {

        const companyApi = `http://localhost:5000/listcompany/${idDetail}`
        const fetchData = async () => {
            const result = await fetch(companyApi, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jobpost_token}`
                },
            })
            result.json().then(json => {
                setCompany(json);
            })
        }
        fetchData();
    }, []);
    useEffect(() => {

        if (!emailUser) {
            return; // Không có người dùng đăng nhập
        }
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
                setStudent(json.profile);
            });
        };
        fetchData();
    }, [emailUser]);

    useEffect(() => {
        setHasUserData(!!localStorage.getItem('user'));
    }, []);

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


    const CompanyName = company.namecompany
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
    
   
    const handleRecommentPost = (id) => {
        const path = `/${id}`
        navigate(path)
        window.location.href = path
    }

    return (
        <div className={cx('Jobpost-wapper')}>
            <div className={cx('banner')}>
                <img src="https://res.cloudinary.com/dg4ifdrn5/image/upload/v1681028747/bannerCompany_dmo0hw.jpg" />
            </div>
            <div className={cx('jobpost-detail')}>
                <div className={cx('jobpost-decription')}>
                    <div className={cx('jobpost-logo')}>
                        <img src={company.logo} />
                        <div className={cx('company-title')}>
                            <div className={cx('info-title')}>
                                <div><h1>{company.namecompany}</h1></div>
                                <div><span className={cx('namecompany_span')}>{company.slogan}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className={cx('div-nav-des')}>
                        <span id="detail" >Chi tiết</span>
                        <span id="about" >Về công ty</span>
                    </div>

                    <div id="content-jobpost" className={cx('jobpost-location-salary-exdate')}>
                        <div className={cx('info-wrapper')}>
                            <div className={cx('maps')}>
                                <label className={cx('title-info')}> Địa điểm</label>
                                <span className={cx('info')}>{company.location}</span>
                            </div>
                            <div className={cx('info-content')}>
                                <div className={cx('content-wrapper')}>
                                    <div className={cx('icon-wrapper')}>
                                        <img src="https://img.icons8.com/external-photo3ideastudio-lineal-photo3ideastudio/64/null/external-calendars-winter-photo3ideastudio-lineal-photo3ideastudio.png" />
                                    </div>

                                    <div className={cx('container')}>
                                        <label className={cx('title-label')}>Email</label>
                                        <span className={cx('info')}>{company.emailcompany}</span>
                                    </div>
                                </div>
                                <div className={cx('content-wrapper')}>
                                    <div className={cx('icon-wrapper')}>
                                        <img src="https://img.icons8.com/ios-glyphs/30/null/lawyer.png" />
                                    </div>
                                    <div className={cx('container')}>
                                        <label className={cx('title-label')}>Số điện thoại</label>
                                        <span className={cx('info')}>{company.phonecompany}</span>
                                    </div>

                                </div>
                                <div className={cx('content-wrapper')}>
                                    <div className={cx('icon-wrapper')}>
                                        <img src="https://img.icons8.com/fluency-systems-filled/48/null/business.png" />
                                    </div>
                                    <div className={cx('container')}>
                                        <label className={cx('title-label')}>Website Công ty</label>
                                        <span className={cx('info')}>{company.websitecompany}</span>
                                    </div>

                                </div>
                        
                            </div>

                        </div>



                        <div className={cx('content')}>
                            <div className={cx('responsibility')}>
                                <span className={cx('span-title')}>Giới thiệu công ty</span>
                                <p>{company.introduce}</p>
                            </div>
                        </div>
                    </div>

                    <div>

                    </div>
                </div>

                <div className={cx('jobpost-recomment')}>
                    <ToastContainer />
                    <h2 style={{ color: '#00133f', fontSize: '25px', marginLeft: '10px', marginTop: '45px', fontWeight: '500' }}>Các công việc của công ty</h2>
                    <ul>
                        {recommentPosts.slice(0, 8).map((recommentPost) => {
                            return (
                                <div key={recommentPost._id} onClick={() => handleRecommentPost(recommentPost._id)} className={cx('recommentPost')}>
                                    <div className={cx('jobpost')}>
                                        <div className={cx('logo_recomment')}>
                                            <div className={cx('wrapper-logo-recomment')}>
                                                <img src={recommentPost.logo} />
                                            </div>
                                        </div>
                                        <div className={cx('detail_post')}>
                                            <h2 className={cx('jobpost-title')}>{recommentPost.title}</h2>
                                            <div className={cx('jobpost-meta')}>
                                                <div className={cx('info_content')}>
                                                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/dusk/64/null/organization.png" />
                                                    <span className={cx('jobpost_company')}>{recommentPost.namecompany}</span>
                                                </div>
                                                <div className={cx('info_content')}>
                                                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/officel/30/null/place-marker--v1.png" />
                                                    <span className={cx('jobpost_location')}>{recommentPost.location}</span>
                                                </div>
                                                <div className={cx('info_content')}>
                                                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/ios/50/null/wallet--v1.png" />
                                                    <span className={cx('jobpost_salary')}>{recommentPost.salary}</span>
                                                </div>


                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )
                        })}
                    </ul>
                </div>
            </div>


        </div>
    );
}

export default DetailCompany;