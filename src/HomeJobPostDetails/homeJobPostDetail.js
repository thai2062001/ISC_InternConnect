import classNames from "classnames/bind";
import styles from './homeJobPostDetail.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import { useParams } from "react-router-dom";
import {  FaLocationArrow, FaMoneyBillAlt,FaCalendarDay } from 'react-icons/fa';


const cx = classNames.bind(styles)
function HomeJobPostDetail() {

    const [jobPosts, setJobPost] = useState({})
    const { id } = useParams();

    const url = new URL(window.location.href);
    const idDetail = url.pathname.split('/').pop();
    const jobpost_token = localStorage.getItem('user-save');
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
    console.log(jobPosts);

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
                            <FaLocationArrow className={cx('icon-d1','location_icon')}/>
                            {jobPosts.location}
                            </div>
                           
                        <div className={cx('jobpost-salary')}>
                        <FaMoneyBillAlt className={cx('icon-d1')}/>
                            {jobPosts.salary}
                            </div>
                        <div className={cx('jobpost-exdate')}>
                            <FaCalendarDay className={cx('icon-d1')}/>
                        {jobPosts.expdate}
                        </div>

                        <div className={cx('apply_button')}>
                            <button>Nộp đơn ngay</button>
                        </div>

                        <div className={cx('div-nav-des')}>
                            <span>Yêu cầu</span>
                            <span>Trách nhiệm </span>
                            <span>Kỹ năng</span>
                            <span>Phúc lợi</span>
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