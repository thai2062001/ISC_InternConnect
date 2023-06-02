import classNames from "classnames/bind";
import styles from './homeJobPostDetail.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import moment from 'moment';
import Popup from "reactjs-popup";
import ApplyCV from "./ApplyCV/ApplyCV";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReportPopup from "./ReportPopup/reportPopup";
import { Helmet } from 'react-helmet';

const cx = classNames.bind(styles)
function HomeJobPostDetail() {

    const [showPopup, setShowPopup] = useState(false)
    const [showPopupReport, setShowPopupReport] = useState(false)
    const [jobPosts, setJobPost] = useState({})
    const [recommentPosts, setRecommentPosts] = useState([])
    const [student, setStudent] = useState({})
    const [company, setCompany] = useState({})
    const [hasUserData, setHasUserData] = useState(!!localStorage.getItem('user'));
    const [data, setData] = useState({});
    const [isFavorite, setIsFavorite] = useState(false);


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
        const API_KEY = 'AIzaSyDaOulQACiJzBfqumbsqg_-vKha8fCnL-s'
        if (jobPosts) {
            const address = jobPosts.location
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
                .then(response => response.json())
                .then(data => setData(data))
                .catch(error => console.error(error));
        }
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
        if (!hasUserData) {
            toast.info('Cần đăng nhập trước khi nộp CV', {
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
    const handleReport = () => {
        if (!hasUserData) {
            toast.info('Cần đăng nhập trước khi báo xấu', {
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
                        setShowPopupReport(true);
                    } else {
                        console.error('Không tồn tại công ty có tên này');
                    }
                })
            }
            fetchData();

        }
    }

    const handleFavorite = () => {
        if (!hasUserData) {
            toast.info('Cần đăng nhập trước khi yêu thích', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        else {
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
                const index = student.favorite.indexOf(favorite);
                if (index > -1) {
                    student.favorite.splice(index, 1);
                }

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
                        toast.success('Xóa khỏi yêu thích!', {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                        setIsFavorite(false)
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            } else {
                const urlAdd = `http://localhost:5000/details/${favorite}`;
                student.favorite.push(favorite);
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
                        toast.success('Thêm vào yêu thích!', {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",

                        });
                        setIsFavorite(true);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
        }
    }

    const handleRecommentPost = (id) => {
        const path = `/${id}`
        navigate(path)
        window.location.href = path
    }
    const handleCompany = (companyLink) => {
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
                const company = json.find(item => item.namecompany === companyLink);
                if (company) {
                    console.log(company._id);
                    const path = `/listcompany/${company._id}`
                    navigate(path)
                    window.location.href = path
                } else {
                    console.error('Không tồn tại công ty có tên này');
                }
            })
        }
        fetchData();
    }




    const handleContent = () => {
        var div1 = document.getElementById("content-jobpost");
        var div2 = document.getElementById("companyabout");

        if (div1.style.display === "none") {
            div1.style.display = "block";
            div2.style.display = "none";
        } else {
            div1.style.display = "none";
            div2.style.display = "block";
        }
    };

    function formatDate(dateString) {
        const date = moment(dateString);
        const formattedDate = date.format('DD/MM/YYYY');
        return formattedDate;
    }
    console.log(company);
    return (
        <div className={cx('Jobpost-wapper')}>
            <Helmet>
                <title>{jobPosts.title}</title>
            </Helmet>
            <div className={cx('banner')}>
                <img src="https://res.cloudinary.com/dg4ifdrn5/image/upload/v1680854951/bannerfix_u56bdz.jpg" />
            </div>
            <div className={cx('jobpost-detail')}>
                <div className={cx('jobpost-decription')}>
                    <div className={cx('jobpost-logo')}>
                        <img src={jobPosts.logo} />
                        <div className={cx('company-title')}>
                            <div className={cx('info-title')}>
                                <div><h2>{jobPosts.title}</h2></div>
                                <div onClick={() => handleCompany(jobPosts.namecompany)} ><span className={cx('namecompany_span')}>{jobPosts.namecompany}</span></div>
                            </div>
                            <div className={cx('apply_button')}>
                                <button className={cx('action_button')} onClick={handleApply}>Nộp đơn ngay</button>
                                {jobPosts && student && localStorage.getItem('user') && (
                                    <Popup open={showPopup} onClose={() => setShowPopup(false)}>
                                        <ApplyCV
                                            expdate={jobPosts.expdate}
                                            id_post={jobPosts._id}
                                            username={Username}
                                            major={student.major}
                                            verify={student.verify}
                                            logo={jobPosts.logo}
                                            title={jobPosts.title}
                                            email={decodeEmail.email}
                                            company={jobPosts.namecompany}
                                            school={student.school}
                                            onClose={() => setShowPopup(false)}
                                        />
                                    </Popup>
                                )}
                                {jobPosts && company && student && localStorage.getItem('user') && (
                                    <Popup open={showPopupReport} onClose={() => setShowPopupReport(false)}>
                                        <ReportPopup
                                            title={jobPosts.title}
                                            email={decodeEmail.email}
                                            companyEmail={company && company.emailcompany}
                                            onClose={() => setShowPopupReport(false)}
                                        />
                                    </Popup>
                                )}
                                <div className={cx('icon_wrapper-like-report')}>
                                    <span onClick={handleFavorite} title="Yêu thích">
                                        {isFavorite ? (
                                            <img className={cx('like_icon')} src="https://img.icons8.com/material-sharp/24/null/hearts.png"/>
                                        ) : <img className={cx('like_icon')} src="https://img.icons8.com/material-outlined/24/null/hearts.png" />}

                                    </span>
                                    <span onClick={handleReport} title="Báo xấu">
                                        <img className={cx('flag_icon')} src="https://img.icons8.com/dotty/80/null/flag.png" />
                                    </span>
                                </div>

                            </div>

                        </div>
                    </div>

                    <div className={cx('div-nav-des')}>
                        <span id="detail" onClick={handleContent}>Chi tiết</span>
                        <span id="about" onClick={handleContent}>Về công ty</span>
                    </div>

                    <div id="content-jobpost" className={cx('jobpost-location-salary-exdate')}>
                        <div className={cx('info-wrapper')}>
                            <div className={cx('maps')}>
                                <label className={cx('title-info')}> Địa điểm</label>
                                <span className={cx('info')}>{jobPosts.place}</span>
                            </div>
                            <div className={cx('info-content')}>
                                <div className={cx('content-wrapper')}>
                                    <div className={cx('icon-wrapper')}>
                                        <img src="https://img.icons8.com/external-photo3ideastudio-lineal-photo3ideastudio/64/null/external-calendars-winter-photo3ideastudio-lineal-photo3ideastudio.png" />
                                    </div>

                                    <div className={cx('container')}>
                                        <label className={cx('title-label')}>Ngày cập nhật</label>
                                        <span className={cx('info')}>{formatDate(jobPosts.DateSubmitted)}</span>
                                    </div>
                                </div>
                                <div className={cx('content-wrapper')}>
                                    <div className={cx('icon-wrapper')}>
                                        <img src="https://img.icons8.com/ios-glyphs/30/null/lawyer.png" />
                                    </div>
                                    <div className={cx('container')}>
                                        <label className={cx('title-label')}>Ngành nghề</label>
                                        <span className={cx('info')}>{jobPosts.major}</span>
                                    </div>

                                </div>
                                <div className={cx('content-wrapper')}>
                                    <div className={cx('icon-wrapper')}>
                                        <img src="https://img.icons8.com/fluency-systems-filled/48/null/business.png" />
                                    </div>
                                    <div className={cx('container')}>
                                        <label className={cx('title-label')}>Hình thức</label>
                                        <span className={cx('info')}>{jobPosts.workingform}</span>
                                    </div>

                                </div>
                                <div className={cx('content-wrapper')}>
                                    <div className={cx('icon-wrapper')}>
                                        <img src="https://img.icons8.com/material-rounded/24/null/us-dollar.png" />
                                    </div>
                                    <div className={cx('container')}>
                                        <label className={cx('title-label')}>Trợ cấp</label>
                                        <span className={cx('info')}>{jobPosts.salary}</span>
                                    </div>

                                </div>
                                <div className={cx('content-wrapper')}>
                                    <div className={cx('icon-wrapper')}>
                                        <img src="https://img.icons8.com/material-outlined/24/null/wall-clock.png" />
                                    </div>
                                    <div className={cx('container')}>
                                        <label className={cx('title-label')}>Cấp bậc</label>
                                        <span className={cx('info')}>Sinh viên/ Thực tập sinh</span>
                                    </div>

                                </div>
                                <div className={cx('content-wrapper')}>
                                    <div className={cx('icon-wrapper')}>
                                        <img src="https://img.icons8.com/external-solid-design-circle/64/null/external-Todo-List-shopping-ande-commerce-solid-design-circle.png" />
                                    </div>
                                    <div className={cx('container')}>
                                        <label className={cx('title-label')}>Hết hạn nộp</label>
                                        <span className={cx('info')}>{formatDate(jobPosts.expdate)}</span>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className={cx('content')}>
                            <div className={cx('benefit')}>
                                {jobPosts.benefit &&
                                    (
                                        <div>
                                            <span className={cx('span-title')}>Phúc lợi</span>
                                            <p>{jobPosts.benefit}</p>
                                        </div>
                                    )}
                            </div>
                            <div className={cx('responsibility')}>
                                <span className={cx('span-title')}>Mô tả công việc</span>
                                <p>{jobPosts.responsibility}</p>
                            </div>
                            <div className={cx('required')}>
                                <span className={cx('span-title')}>Yêu cầu</span>
                                <p>{jobPosts.required}</p>
                            </div>
                        </div>
                    </div>

                    <div id="companyabout" className={cx('company_about')}>
                        {company && (
                            <div className={cx('benefit')}>
                                <div className={cx('introduce_company')}>
                                    <span className={cx('span-title')}>Giới thiệu công ty</span>
                                    {company && (
                                        <p>{company.introduce}</p>
                                    )}
                                </div>
                                <div>

                                </div>
                            </div>
                        )}
                    </div>
                    <div>

                    </div>
                </div>

                <div className={cx('jobpost-recomment')}>
                    <ToastContainer />
                    <h2 style={{ color: '#00133f', fontSize: '25px', marginLeft: '10px', marginTop: '45px', fontWeight: '500' }}>Các công việc tương tự</h2>
                    <ul>
                        {recommentPosts.slice(0, 5).map((recommentPost) => {
                             const title = recommentPost.title.length > 50 ? recommentPost.title.slice(0, 50) + '...' : recommentPost.title;
                             const location = recommentPost.location.length > 50 ? recommentPost.location.slice(0, 50) + '...' : recommentPost.location;
                            return (
                                <div key={recommentPost._id} onClick={() => handleRecommentPost(recommentPost._id)} className={cx('recommentPost')}>
                                    <div className={cx('jobpost')}>
                                        <div className={cx('logo_recomment')}>
                                            <div className={cx('wrapper-logo-recomment')}>
                                                <img src={recommentPost.logo} />
                                            </div>
                                        </div>
                                        <div className={cx('detail_post')}>
                                            <h2 className={cx('jobpost-title')}>{title}</h2>
                                            <div className={cx('jobpost-meta')}>
                                                <div className={cx('info_content')}>
                                                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/dusk/64/null/organization.png" />
                                                    <span className={cx('jobpost_company')}>{recommentPost.namecompany}</span>
                                                </div>
                                                <div className={cx('info_content')}>
                                                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/officel/30/null/place-marker--v1.png" />
                                                    <span className={cx('jobpost_location')}>{location}</span>
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

export default HomeJobPostDetail;