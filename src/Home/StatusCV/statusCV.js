import classNames from "classnames/bind";
import styles from "./statusCV.module.scss";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from "jwt-decode";
import moment from 'moment';
import ReactPaginate from 'react-paginate';

const cx = classNames.bind(styles);

function StatusCV() {
    const [jobApplication, setJobApplication] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const applicationsPerPage = 5;
    const pagesVisited = pageNumber * applicationsPerPage;

    useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
    }, [])

    const URL = 'http://localhost:5000/cv';
    const jobapptoken = localStorage.getItem('user-save');

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

    const date_string = jobApplication.date;
    const formatted_date = moment(date_string).format('DD/MM/YYYY');


    const handleJobpost = (id)=>{
        window.location.href = `${id}`
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <ul className={cx('jobapp')}>
                    {jobApplication.slice(pagesVisited, pagesVisited + applicationsPerPage).map((jobApp, index) => {
                        return (
                            <div onClick={()=>handleJobpost(jobApp.id_post)} className={cx('jobapp_container')} key={index}>
                                <div className={cx('logo')}>
                                    <img src={jobApp.logo}/>
                                </div>
                                <div className={cx('jobapp_detail')}>
                                    <span className={cx('jobapp_span','title_span')}>{jobApp.title}</span>
                                    <span className={cx('jobapp_span','company_span')}>{jobApp.namecompany}</span>
                                    <span className={cx('jobapp_span','date_span')}>{formatted_date}</span>
                                    <span className={cx('jobapp_span','status_span')}>{jobApp.status}</span>
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