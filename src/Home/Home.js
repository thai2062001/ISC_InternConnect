import classNames from 'classnames/bind';
import styles from './Home.module.scss'
import { FaAngleDoubleRight, FaAngleDoubleLeft, FaArrowRight, FaLocationArrow, FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';



const cx = classNames.bind(styles)
function Home() {
  const [accounts, setAccount] = useState([])
  const [listJobPosts, setListJobPosts] = useState([])
  const [jobpostSearch, setJobPostSearch] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(15);

  const pageCount = Math.ceil(listJobPosts.length / postsPerPage);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = listJobPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
    window.scrollTo(0, 0);
  };



  const URL = 'http://localhost:5000/admin/account'
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(URL)
      result.json().then(json => {
        setAccount(json)
      })
    }
    fetchData();
  }, []);

  const api = 'http://localhost:5000/'
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(api)
      result.json().then(json => {
        setListJobPosts(json);
        setJobPostSearch(json);
      })
    }
    fetchData();
  }, []);
  const handleFilter = () =>{
    const major = document.getElementById('major').value.toLowerCase();
    const location = document.getElementById('location').value.toLowerCase();
  }

  const handleSearch = () => {
    const inputJob = document.getElementById('job-search').value.toLowerCase();
    const inputLocation = document.getElementById('location-search').value.toLowerCase();

    if (!inputJob && !inputLocation) {
      setListJobPosts(jobpostSearch);
      return;
    }
    const filteredPosts = jobpostSearch.filter((post) => {
      const jobTitle = post.title.toLowerCase();
      const location = post.location.toLowerCase();

      if (inputJob && inputLocation) {
        return (
          jobTitle.includes(inputJob.toLowerCase()) &&
          location.includes(inputLocation.toLowerCase())
        );
      } else if (inputJob) {
        return jobTitle.includes(inputJob.toLowerCase());
      } else if (inputLocation) {
        return location.includes(inputLocation.toLowerCase());
      }
    });

    setListJobPosts(filteredPosts);
  };


  const HandleNext = () => {
    let lists = document.querySelectorAll('#item');
    document.getElementById('slide').appendChild(lists[0]);
  }

  const HandlePrev = () => {
    let lists = document.querySelectorAll('#item');
    document.getElementById('slide').prepend(lists[lists.length - 1]);
  }

  const handleDetail = (id) => {
    window.location.href = `/${id}`
  }

  return (
    <div className={cx('container_full')}>
      <Helmet>
        <title>Trang chủ</title>
      </Helmet>
      <div className={cx('container')}>
        <div className={cx('search')}>
          <div className={cx('search-banner')}>
            <div className={cx('banner-wrapper')}>
              <img src='https://dxwd4tssreb4w.cloudfront.net/images/common/background-cover/careerlink_engineering_office.jpg' className={cx('banner-img')} />
            </div>
            <div className={cx('banner-wrapper-search')}>
              <h1 id='title'>Tìm việc nhanh chóng, dễ dàng</h1>
              <div className={cx('banner-div')}>
                <div className={cx('input-1')}>
                  <FaSearch className={cx('seach-icon')} />
                  <input id='job-search' className={cx('input-search-job')} placeholder='Nhập từ khóa,Công việc' />
                </div>
                <div className={cx('input-2')}>
                  <FaLocationArrow className={cx('seach-icon')} />
                  <input id='location-search' className={cx('input-search-location')} placeholder='Nhập thành phố' />
                </div>

                <div className={cx('search-button')}>
                  <FaSearch className={cx('seach-icon-button')} />
                  <button onClick={handleSearch}>Tìm kiếm</button>
                  <ToastContainer />
                </div>
              </div>
            </div>
          </div>

          <div className={cx('filter_wrapper')}>
            <div className={cx('input-3')}>
              <select onChange={handleFilter} id='major'>
                <option value=''>Chọn chuyên ngành</option>
                <option value='Công nghệ thông tin'>Công nghệ thông tin</option>
                <option value='Tài chính'>Tài chính</option>
                <option value='Kế toán'>Kế toán</option>
                <option value='Quản trị kinh doanh'>Quản trị kinh doanh</option>
              </select>
            </div>
            <div className={cx('input-4')}>
              <select onChange={handleFilter} id='location'>
                <option value=''>Chọn địa chỉ</option>
                <option value='Hà nội'>Hà Nội</option>
                <option value='HCM'>Hồ Chí Minh</option>
                <option value='Đà Nẵng'>Đà Nẵng</option>
              </select>
            </div>

          </div>


        </div>
      </div>
      <div className={cx('wrapper_jobpost')}>
        <div className={cx('jobpost')}>
          <div className={cx('jobpost-title')}>
            <span>Thực tập hấp dẫn</span>
            <ul className={cx('jobpost-preview')}>
              {currentPosts.splice(0, 15).map((jobPost, index) => (
                <div onClick={() => handleDetail(jobPost._id)} className={cx('jobpost-description')} key={index}>
                  <div className={cx('logo')}>
                    <img src={jobPost.logo} />
                  </div>
                  <div className={cx('jobpost_detail')}>
                    <h2 >{jobPost.title}</h2>
                    <div className={cx('wrapper_content')}>
                      <span className={cx('detail_span', 'company')}>  {jobPost.namecompany}</span>
                    </div>
                    <div className={cx('wrapper_content')}>
                      <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/officel/30/null/place-marker--v1.png" />
                      <span className={cx('detail_span', 'location')}>{jobPost.location}</span>
                    </div>
                    <div className={cx('wrapper_content')}>
                      <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/ios/50/null/wallet--v1.png" />
                      <span className={cx('detail_span', 'salary')}>{jobPost.salary}</span>
                    </div>


                  </div>
                </div>
              ))}
            </ul>
          </div>

          {/* Hiển thị nút phân trang */}
          <ReactPaginate
            previousLabel={'Trang trước'}
            nextLabel={'Trang sau'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={cx('pagination')}
            activeClassName={'active'}
          />
        </div>
      </div>


      <div className={cx('wrapper')}>
        <h1>Các công ty nổi bật</h1>
        <div id='slide' className={cx('banner')}>
          <div id='item' className={cx('item', 'Viettel')}  >
            <div className={cx('content')}>
              <div className={cx('from')}>Viettel Group</div>
              <div className={cx('name')}>Viettel - Show us your way</div>
              <div className={cx('address')}> <FaLocationArrow /> Quận Cầu Giấy, Hà Nội</div>
              <div className={cx('decription')}>
                <div className={cx('type')}>Fintech</div>
                <div className={cx('moreDetails')}><span>Details <FaArrowRight /></span></div>
              </div>
            </div>
          </div>
          <div id='item' className={cx('item', 'Fpt')}  >
            <div className={cx('content')}>
              <div className={cx('from')}>FPT Software</div>
              <div className={cx('name')}>FPT Software - You can make it!</div>
              <div className={cx('address')}> <FaLocationArrow /> Quận Cầu Giấy,Hà Nội</div>
              <div className={cx('decription')}>
                <div className={cx('type')}>Phần mềm</div>
                <div className={cx('moreDetails')}><span>Details <FaArrowRight /></span></div>
              </div>
            </div>
          </div>
          <div id='item' className={cx('item', 'BIDV')} >
            <div className={cx('content')}>
              <div className={cx('from')}>Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)</div>
              <div className={cx('name')}></div>
              <div className={cx('address')}> <FaLocationArrow /> Quận Hai Bà Trưng,Hà Nội</div>
              <div className={cx('decription')}>
                <div className={cx('type')}>Ngân Hàng</div>
                <div className={cx('moreDetails')}><span>Details <FaArrowRight /></span></div>
              </div>
            </div>
          </div>
          <div id='item' className={cx('item', 'VIB')}>
            <div className={cx('content')}>
              <div className={cx('from')}>Ngân hàng Quốc Tế VIB</div>
              <div className={cx('name')}>VIB - Luôn gia tăng giá trị cho bạn</div>
              <div className={cx('address')}> <FaLocationArrow /> Quận 1, Hồ Chí Minh</div>
              <div className={cx('decription')}>
                <div className={cx('type')}>Ngân Hàng</div>
                <div className={cx('moreDetails')}><span>Details <FaArrowRight /></span></div>
              </div>
            </div>
          </div>
          <div id='item' className={cx('item', 'TMA')} >
            <div className={cx('content')}>
              <div className={cx('from')}>TMA Tech Group</div>
              <div className={cx('name')}>TMA Technology Group – Tập đoàn Công nghệ hàng đầu Việt Nam</div>
              <div className={cx('address')}> <FaLocationArrow /> Quận 12, Hồ Chí Minh</div>
              <div className={cx('decription')}>
                <div className={cx('type')}>Outsourcing</div>
                <div className={cx('moreDetails')}><span>Details <FaArrowRight /></span></div>
              </div>
            </div>
          </div>
          <div id='item' className={cx('item', 'MoMo')}>
            <div className={cx('content')}>
              <div className={cx('from')}>MoMo</div>
              <div className={cx('name')}>Ví Điện Tử MoMo - Siêu Ứng Dụng Thanh Toán số 1 Việt Nam</div>
              <div className={cx('address')}> <FaLocationArrow /> Quận 7,Hồ Chí Minh</div>
              <div className={cx('decription')}>
                <div className={cx('type')}>Fintech</div>
                <div className={cx('moreDetails')}><span>Details <FaArrowRight /></span></div>
              </div>
            </div>
          </div>
        </div>
        <div className={cx('buttons')}>
          <button className={cx('prev')} onClick={HandlePrev} id='prev'>
            <FaAngleDoubleLeft />
          </button>
          <button onClick={HandleNext} id='next'>
            <FaAngleDoubleRight />
          </button>
        </div>
      </div>

    </div>
  );

}

export default Home;