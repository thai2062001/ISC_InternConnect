import classNames from "classnames/bind";
import styles from "./statusCV.module.scss";
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from "jwt-decode";
import moment from 'moment';

const cx = classNames.bind(styles);

function StatusCV() {
    const [jobApplication, setJobApplication] = useState([]);


    useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        // console.log(decodeUser.username);
        // console.log(decodeUser.email);
    }, [])

    const URL = 'http://localhost:5000/cv'
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

    const date_string = jobApplication.date;
    const date = moment(date_string);
    const formatted_date = date.format('DD/MM/YYYY');
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <ul className={cx('jobapp')}>
                    {jobApplication.map((jobApp, index) => {
                        return (
                            <div className={cx('jobapp_container')} key={index}>
                                <div className={cx('logo')}>
                                    <img src="https://viettel.com.vn/media/viettel/original_images/Viettel_logo_2021.png"/>
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
       
               
            </div>

        </div>
    );
}

export default StatusCV;