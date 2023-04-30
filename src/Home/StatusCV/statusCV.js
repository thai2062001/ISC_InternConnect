import classNames from "classnames/bind";
import styles from "./statusCV.module.scss";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaAngleDoubleRight, FaAngleDoubleLeft, FaArrowRight, FaLocationArrow, FaSearch, FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import jwt_decode from "jwt-decode";
import moment from 'moment';
import { useNavigate } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import { Helmet } from 'react-helmet';
const cx = classNames.bind(styles);

function StatusCV() {
    const [jobApplication, setJobApplication] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const applicationsPerPage = 4;
    const pagesVisited = pageNumber * applicationsPerPage;
    const jobpost_token = localStorage.getItem('user');
    const navigate = useNavigate();

    useEffect(() => {
        const localstore = localStorage.getItem('user')
        const decodeUser = jwt_decode(localstore);
    }, [])

    const URL = 'http://localhost:5000/cv';
    const jobapptoken = localStorage.getItem('user');

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jobapptoken}`
                },
            })
            result.json().then(json => {
                setJobApplication(json)
            })
        }
        fetchData();
    }, []);

    const pageCount = Math.ceil(jobApplication.length / applicationsPerPage);
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    
//   function formatDate(dateString) {
//     const date = moment(dateString);
//     const formattedDate = date.format('DD/MM/YYYY');
//     return formattedDate;
//   }
function formatDate(dateString) {
    const date = moment(dateString);
    const today = moment().startOf('day');
    const daysAgo = today.isSame(date, 'd') ? 'Hôm nay' : moment().diff(date, 'days') + ' ngày trước';
    return daysAgo;
  }

    const handleJobpost = (id) => {
        window.location.href = `${id}`
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
    return (
        <div className={cx('wrapper')}>
            <Helmet>
                <title>Quản lý trạng thái</title>
            </Helmet>
            <div className={cx('container')}>
                <h2>Quản lý trạng thái hồ sơ</h2>
                <ul className={cx('jobapp')}>
                    {jobApplication.slice(pagesVisited, pagesVisited + applicationsPerPage).map((jobApp, index) => {
                        return (
                            <div  className={cx('jobapp_container')} key={index}>
                                <div onClick={() => handleJobpost(jobApp.id_post)} className={cx('logo')}>
                                    <div className={cx('wrapper-logo')}>
                                        <img src={jobApp.logo} />
                                    </div>
                                </div>
                                <div className={cx('jobapp_detail')}>
                                    <div onClick={() => handleJobpost(jobApp.id_post)} className={cx('title-div')}>
                                        <span className={cx('jobapp_span', 'title_span')}>{jobApp.title}</span>
                                    </div>
                                    <div onClick={() => handleCompany(jobApp.namecompany)}  className={cx('jobpost-icon')}>
                                        <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/dusk/64/null/organization.png" />
                                        <span className={cx('jobapp_span', 'company_span')}> {jobApp.namecompany}</span>
                                    </div>
                                    <div className={cx('jobpost-icon')}>
                                        <img src="https://img.icons8.com/ios/50/null/calendar-26.png" />
                                        <span className={cx('jobapp_span', 'date_span')}>Ngày nộp: {formatDate(jobApp.date)} </span>
                                    </div>
                                    <div className={cx('jobpost-icon')}>
                                        <span className={cx('jobapp_span',)}>Trạng thái: </span>
                                        <span className={cx('jobapp_span', 'status_span')}> {jobApp.status}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </ul>
                <div className={cx('pagination-container')}>
                    <ReactPaginate
                        previousLabel={'<'}
                        nextLabel={'>'}
                        pageCount={pageCount}
                        onPageChange={changePage}
                        containerClassName={cx('pagination')}
                        activeClassName={cx('active')}
                        previousClassName={cx('previous')}
                        nextClassName={cx('next')}
                        disabledClassName={cx('disabled')}
                        breakClassName={cx('break-me')}
                        pageClassName={cx('page')}
                    />
                </div>


            </div>
        </div>
    );
}

export default StatusCV;