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

    const [company, setCompany] = useState({})
    const [jobPosts, setJobPost] = useState({})
    const [recommentPosts, setRecommentPosts] = useState([])

    const { id } = useParams();
    const navigate = useNavigate();
    const url = new URL(window.location.href);
    const idDetail = url.pathname.split('/').pop();
    const jobpost_token = localStorage.getItem('user');


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
                console.log(json);
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
    
console.log('recomment',recommentPosts);

    const handleRecommentPost = (id) => {
        const path = `/${id}`
        navigate(path)
        window.location.href = path
    }

    return (
        <div className={cx('Jobpost-wapper')}>
            <div className={cx('jobpost-detail')}>
                <div className={cx('banner')}>
                    <img src="https://dxwd4tssreb4w.cloudfront.net/web/images/default_banner_2.svg" />
                </div>
                <div className={cx('jobpost-decription')}>
                    <div className={cx('jobpost-logo')}>
                        <img src={company.logo} />
                        <div className={cx('company-title')}>
                            <div><h1>{company.namecompany}</h1></div>
                            <div><span className={cx('namecompany_span')}>{company.phonecompany}</span></div>
                        </div>
                    </div>
                    <div className={cx('jobpost-location-salary-exdate')}>
                        <div className={cx('jobpost-location')}>
                            <FaLocationArrow className={cx('icon-d1', 'location_icon')} />
                            {company.emailcompany}
                        </div>

                        <div className={cx('jobpost-salary')}>
                            <FaMoneyBillAlt className={cx('icon-d1')} />
                            {company.websitecompany}
                        </div>
                        <ToastContainer />
                        <div className={cx('div-nav-des')}>
                            <span>Slogan</span>
                            <span>Giới thiệu </span>
                        </div>
                        <div className={cx('content')}>

                            <div className={cx('required')}>
                                <span className={cx('span-title')}>Yêu cầu</span>
                                <p>{company.slogan}</p>
                            </div>
                            <div className={cx('responsibility')}>
                                <span className={cx('span-title')}>Trách nhiệm</span>
                                <p>{company.introduce}</p>
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
                

            </div>
            <div className={cx('jobpost-recomment')}>
                <h2 style={{ fontSize: '30px', marginLeft: '10px', fontWeight: '500' }}>Gợi ý việc làm</h2>
                <ul>
                    {recommentPosts.slice(0, 8).map((recommentPost) => {
                        return (
                            <div key={recommentPost._id} onClick={() => handleRecommentPost(recommentPost._id)} className={cx('recommentPost')}>
                                <div className={cx('jobpost')}>
                                    <div className={cx('logo_recomment')}>
                                        <img src={recommentPost.logo} />
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
    );
}

export default DetailCompany;