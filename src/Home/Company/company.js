// import classNames from 'classnames/bind';
// import styles from './company.module.scss'
// import { FaAngleDoubleRight, FaAngleDoubleLeft, FaArrowRight, FaLocationArrow, FaSearch } from 'react-icons/fa';
// import { useEffect, useState } from 'react';
// import jwt_decode from "jwt-decode";
// import ReactPaginate from 'react-paginate';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { Helmet } from 'react-helmet';



// const cx = classNames.bind(styles)
// function Company() {
//   const [accounts, setAccount] = useState([])
//   const [listcompany, setListCompany] = useState([])
//   const [companySearch, setCompanySearch] = useState([])
//   const [currentPage, setCurrentPage] = useState(1);
//   const [postsPerPage, setPostsPerPage] = useState(15);

//   const pageCount = Math.ceil(listcompany.length / postsPerPage);

//   const indexOfLastPost = currentPage * postsPerPage;
//   const indexOfFirstPost = indexOfLastPost - postsPerPage;
//   const currentPosts = listcompany.slice(indexOfFirstPost, indexOfLastPost);

//   const handlePageClick = (data) => {
//     const selectedPage = data.selected + 1;
//     setCurrentPage(selectedPage);
//     window.scrollTo(0, 0);
//   };


//   const URL = 'http://localhost:5000/admin/account'
//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await fetch(URL)
//       result.json().then(json => {
//         setAccount(json)
//       })
//     }
//     fetchData();
//   }, []);

//   const api = 'http://localhost:5000/company/listcompany'
//   useEffect(() => {
//     const fetchData = async () => {
//       const result = await fetch(api)
//       result.json().then(json => {
//         setListCompany(json);
//       })
//     }
//     fetchData();
//   }, []);


//   const handleDetail = (id) => {
//     window.location.href = `/${id}`
//   }

//   return (
//     <div className={cx('container_full')}>
//       <Helmet>
//         <title>Trang chủ</title>
//       </Helmet>
//       <div className={cx('container')}>
//         <div className={cx('search')}>
//           <div className={cx('search-banner')}>
//             <div className={cx('banner-wrapper')}>
//               <img src='https://dxwd4tssreb4w.cloudfront.net/images/common/background-cover/careerlink_engineering_office.jpg' className={cx('banner-img')} />
//             </div>
//             <div className={cx('banner-wrapper-search')}>
//               <h1 id='title'>Tìm việc nhanh chóng, dễ dàng</h1>
//               <div className={cx('banner-div')}>
//                 <div className={cx('input-1')}>
//                   <FaSearch className={cx('seach-icon')} />
//                   <input id='job-search' className={cx('input-search-job')} placeholder='Nhập từ khóa,Công việc' />
//                 </div>
//                 <div className={cx('input-2')}>
//                   <FaLocationArrow className={cx('seach-icon')} />
//                   <input id='location-search' className={cx('input-search-location')} placeholder='Nhập thành phố' />
//                 </div>

//                 <div className={cx('search-button')}>
//                   <FaSearch className={cx('seach-icon-button')} />
//                   <button onClick={handleSearch}>Tìm kiếm</button>
//                   <ToastContainer />
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//       <div className={cx('wrapper_jobpost')}>
//         <div className={cx('jobpost')}>
//           <div className={cx('jobpost-title')}>
//             <span>Danh sách công ty</span>
//             <ul className={cx('jobpost-preview')}>
//               {currentPosts.splice(0, 15).map((company, index) => (
//                 <div onClick={() => handleDetail(company._id)} className={cx('jobpost-description')} key={index}>
//                   <div className={cx('logo')}>
//                     <img src={company.logo} />
//                   </div>
//                   <div className={cx('jobpost_detail')}>
//                     <h2 >{company.title}</h2>
//                     <div className={cx('wrapper_content')}>
//                     <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/dusk/64/null/organization.png"/>
//                       <span className={cx('detail_span', 'company')}>  {jobPost.namecompany}</span>
//                     </div>
//                     <div className={cx('wrapper_content')}>
//                       <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/officel/30/null/place-marker--v1.png" />
//                       <span className={cx('detail_span', 'location')}>{jobPost.location}</span>
//                     </div>
//                     <div className={cx('wrapper_content')}>
//                       <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/ios/50/null/wallet--v1.png" />
//                       <span className={cx('detail_span', 'salary')}>{jobPost.salary}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </ul>

//           </div>
//           <div className={cx('banner_right')}>
//           <img src='https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages.vietnamworks.com%2Flogo%2F500x600_122601.png&w=1920&q=75'/>
//           <div>
//             <img className={cx('img-2')} src ='https://img.timviec.com.vn/2021/06/dang-tin-tuyen-dung-14.jpg'/>
//           </div>
//         </div>

//           {/* Hiển thị nút phân trang */}
//           <ReactPaginate
//             previousLabel={'Trang trước'}
//             nextLabel={'Trang sau'}
//             breakLabel={'...'}
//             pageCount={pageCount}
//             marginPagesDisplayed={2}
//             pageRangeDisplayed={5}
//             onPageChange={handlePageClick}
//             containerClassName={cx('pagination')}
//             activeClassName={'active'}
//           />
//         </div>
//       </div>
//       </div>

//   );

// }

// export default Company;