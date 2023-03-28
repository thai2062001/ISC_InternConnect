import classNames from "classnames/bind";
import styles from './homeJobPostDetail.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import { useParams, useNavigate } from "react-router-dom";
import { FaLocationArrow, FaMoneyBillAlt, FaCalendarDay, FaHeart } from 'react-icons/fa';
import moment from 'moment';
import Popup from "reactjs-popup";
import ApplyCV from "./ApplyCV/ApplyCV";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const cx = classNames.bind(styles)
function HomeJobPostDetail() {

    const [showPopup, setShowPopup] = useState(false)
    const [jobPosts, setJobPost] = useState({})
    const [recommentPosts, setRecommentPosts] = useState([])
    const [student, setStudent] = useState({})
    const [company, setCompany] = useState({})
    const [hasUserData, setHasUserData] = useState(!!localStorage.getItem('user'));

    const navigate = useNavigate();

    const tabs = ['posts', 'comments', 'albums', 'photos', 'todos', 'users']

    const { id } = useParams();
    const url = new URL(window.location.href);
    const idDetail = url.pathname.split('/').pop();
    const favorite = url.pathname.split('/').pop();
    const jobpost_token = localStorage.getItem('user');
    const decodeEmail = jobpost_token ? jwt_decode(jobpost_token) : null;
    const emailUser = decodeEmail ? decodeEmail.email : null;
    const Username = decodeEmail ? decodeEmail.username : null;


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

    useEffect(() => {

        const companyApi = 'http://localhost:5000/listcompany'
        const fetchData = async () => {
            const result = await fetch(companyApi, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jobpost_token}`
                },
            })
            result.json().then(json => {
                const company = json.find(item => item.namecompany === CompanyName);
                if (company) {
                    setCompany(company);
                } else {
                    console.error('Không tồn tại công ty có tên này');
                }
            })
        }
        fetchData();
    }, []);


    const handleApply = () => {
        if (!hasUserData) {
            toast.info('Please login before applying', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            setShowPopup(true);
        }
    };

    const handleFavorite = () => {
        const access_token = localStorage.getItem('user');
        const decodeEmail = jwt_decode(access_token);
        const urlDelete = `http://localhost:5000/details/delete-fa/${favorite}`;

        const isIdInFavorite = (id) => {
            if (student.favorite.includes(id)) {
                return true;
            }
            return false;
        }

        if (isIdInFavorite(favorite)) {
            // Remove the ID from the favorite array if it exists
            const index = student.favorite.indexOf(favorite);
            if (index > -1) {
                student.favorite.splice(index, 1);
            }
            // Update the server
            fetch(urlDelete, {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + access_token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ favorite: student.favorite })
            })
                .then(response => response.json())
                .then(data => {
                    toast.success('Removed from favorites!', {
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
                    console.error('Error:', error);
                });
        } else {
            const urlAdd = `http://localhost:5000/details/${favorite}`;
            // Add the ID to the favorite array
            student.favorite.push(favorite);
            // Update the server
            fetch(urlAdd, {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + access_token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ favorite: student.favorite })
            })
                .then(response => response.json())
                .then(data => {
                    toast.success('Added to favorites!', {
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
                    console.error('Error:', error);
                });
        }
    }
    const handleRecommentPost = (id) => {
        const path = `/${id}`
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
                            <div><span className={cx('namecompany_span')}>{jobPosts.namecompany}</span></div>
                            <div className={cx('company_a')} >
                                <a className={cx('company_span')} id="company_span" href="https://example.com" target="_blank"> Về công ty
                                
                                </a>
                            </div>

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
                        {jobPosts && student && localStorage.getItem('user-save') && (
                            <Popup open={showPopup} onClose={() => setShowPopup(false)}>
                                <ApplyCV
                                    expdate={jobPosts.expdate}
                                    id_post={jobPosts._id}
                                    username={Username}
                                    major={student.major}
                                    logo={jobPosts.logo}
                                    title={jobPosts.title}
                                    email={decodeEmail.email}
                                    company={jobPosts.namecompany}
                                    school={student.school}
                                    onClose={() => setShowPopup(false)}
                                />
                            </Popup>
                        )}

                        <div className={cx('apply_button')}>
                            <button className={cx('action_button')} onClick={handleApply}>Nộp đơn ngay</button>
                            <ToastContainer />
                            <button onClick={handleFavorite} className={cx('like_button')}><FaHeart style={{ marginTop: '7px' }} /></button>
                        </div>

                        <div className={cx('div-nav-des')}>
                            <span>Yêu cầu</span>
                            <span>Trách nhiệm </span>
                            <span>Kỹ năng</span>
                            <span>Về công ty</span>
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
                            <div className={cx('benefit')}>
                                <span className={cx('span-title')}>Phúc lợi</span>
                                <p>{jobPosts.benefit}</p>
                            </div>
                            <div className={cx('benefit')}>
                                <span className={cx('span-title')}>Giới thiệu công ty</span>
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

export default HomeJobPostDetail;