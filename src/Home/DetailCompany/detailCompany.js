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

    const { id } = useParams();
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
    console.log(company);

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
                </div>
            </div>

        </div>
    );
}

export default DetailCompany;