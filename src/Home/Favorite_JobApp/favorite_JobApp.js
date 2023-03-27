import classNames from "classnames/bind";
import styles from "./favorite_JobApp.module.scss";
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from "jwt-decode";
import moment from 'moment';
import ReactPaginate from 'react-paginate';


const cx = classNames.bind(styles)

function Favorite_JobApp() {
  const [students, setStudent] = useState([])
  const [listJobPosts, setListJobPosts] = useState([])
  const [pageNumber, setPageNumber] = useState(0);
  const applicationsPerPage = 4;
  const pagesVisited = pageNumber * applicationsPerPage;

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
  return (
    <div className={cx('wrapper')}>

      <div className={cx('container')}>
        <h1 style={{ fontSize: '35px', fontweight: '600', marginTop: '20px', marginBottom: '40px', marginLeft: '40px' }}>Bài đăng yêu thích</h1>
        <ul className={cx('jobapp')}>
          {listJobPosts.slice(pagesVisited, pagesVisited + applicationsPerPage).map((jobpost, index) => {
            return (
              <div onClick={() => handleJobpost(jobpost._id)} className={cx('jobapp_container')} key={index}>
                <div className={cx('logo')}>
                  <img src={jobpost.logo} />
                </div>
                <div className={cx('jobapp_detail')}>
                  <span className={cx('jobapp_span', 'title_span')}>{jobpost.title}</span>

                  <div className={cx('info_content')}>
                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/dusk/64/null/organization.png" />
                    <span className={cx('jobapp_span', 'company_span')}>{jobpost.namecompany}</span>
                  </div>


                  <div className={cx('info_content')}>
                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/officel/30/null/place-marker--v1.png" />
                    <span className={cx('jobapp_span', 'date_span')}>{jobpost.location}</span>
                  </div>

                  <div className={cx('info_content')}>
                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/ios/50/null/wallet--v1.png" />
                    <span className={cx('jobapp_span', 'status_span')}>{jobpost.salary}</span>
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