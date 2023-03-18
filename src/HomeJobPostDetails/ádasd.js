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

    const handleApply = () => {
        setShowPopup(true)
    }

    const handleRecommentPost = (id) => {
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


                    </div>

                </div>
            </div>
            /</div>


    );
}

export default HomeJobPostDetail;