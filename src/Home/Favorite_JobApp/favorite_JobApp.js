import classNames from "classnames/bind";
import styles from "./favorite_JobApp.module.scss";
import React, { useState, useEffect, useRef } from "react";
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';
import ReactPaginate from 'react-paginate';


const cx = classNames.bind(styles)

function Favorite_JobApp() {
  const [students, setStudent] = useState([])
  const [listJobPosts, setListJobPosts] = useState([])
  const [pageNumber, setPageNumber] = useState(0);
  const applicationsPerPage = 3;
  const pagesVisited = pageNumber * applicationsPerPage;

  const navigate = useNavigate();
  const jobpost_token = localStorage.getItem('user');
  const localstore = localStorage.getItem('user')
  const decodeEmail = jwt_decode(localstore);
  const emailUser = decodeEmail.email;

  //call api sv
  //http://localhost:5000/profile
  useEffect(() => {
    const fetchData = async () => {
      const infoStudent = 'http://localhost:5000/profile'
      const result = await fetch(infoStudent, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localstore}`
        },
      })
      const json = await result.json();
      const student = json.profile.studentemail === emailUser ? json.profile : null;
      if (student) {
        setStudent(student);
      } else {
        console.error('Không tồn tại bài đăng có id này');
      }
    }
    fetchData();
  }, [emailUser]);


  //call api jobpostlist
  const api = 'http://localhost:5000/'
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(api);
      const jobPosts = await result.json();
      const favoriteIds = students.favorite ?? [];
      const favoriteJobPosts = jobPosts.filter(jobpost => favoriteIds.includes(jobpost._id));
      setListJobPosts(favoriteJobPosts);
    };
    fetchData();
  }, [students.favorite]);

  const pageCount = Math.ceil(listJobPosts.length / applicationsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };


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
      <div className={cx('container')}>
        <Helmet>
          <title>Yêu thích</title>
        </Helmet>
        <h2>Quản lý yêu thích</h2>
        <ul className={cx('jobapp')}>
          {listJobPosts.slice(pagesVisited, pagesVisited + applicationsPerPage).map((jobApp, index) => {
            return (
              <div onClick={() => handleJobpost(jobApp._id)} className={cx('jobapp_container')} key={index}>
                <div className={cx('logo')}>
                  <div className={cx('wrapper-logo')}>
                    <img src={jobApp.logo} />
                  </div>
                </div>
                <div className={cx('jobapp_detail')}>
                  <div className={cx('title-div')}>
                    <span className={cx('jobapp_span', 'title_span')}>{jobApp.title}</span>
                  </div>
                  <div onClick={() => handleCompany(jobApp.namecompany)} className={cx('jobpost-icon')}>
                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/dusk/64/null/organization.png" />
                    <span className={cx('jobapp_span', 'company_span')}> {jobApp.namecompany}</span>
                  </div>
                  <div className={cx('salary-icon')}>
                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/ios/50/null/wallet--v1.png" />
                    <span className={cx('jobapp_span', 'salary_span')}> {jobApp.salary}</span>
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

export default Favorite_JobApp;