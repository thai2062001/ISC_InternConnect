import classNames from 'classnames/bind';
import styles from './Home.module.scss'
import { FaAngleDoubleRight, FaAngleDoubleLeft, FaArrowRight, FaLocationArrow, FaSearch, FaHeart } from 'react-icons/fa';
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
  const [jobpostFilter, setJobPostFilter] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(18);
  const [listmajor, setListMajor] = useState([])
  const [originalJobPosts, setOriginalJobPosts] = useState([]);
  const [selectedMajor, setSelectedMajor] = useState('');

  const pageCount = Math.ceil(listJobPosts.length / postsPerPage);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = listJobPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
    window.scrollTo(0, 0);
  };
  const apiUrl = 'http://localhost:5000/listmajor'
  const major_token = localStorage.getItem('user');
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${major_token}`
        },
      });
      result.json().then(json => {
        setListMajor(json);
      });
    };
    fetchData();
  }, []);



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
        setOriginalJobPosts(json);
        setJobPostSearch(json);
        setJobPostFilter(json)
      })
    }
    fetchData();
  }, []);


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


  const handleFilter = (e) => {
    const selectedMajor = e.target.value;
    setSelectedMajor(selectedMajor);

    if (selectedMajor === 'Tất cả') { // Kiểm tra nếu giá trị được chọn là 'Tất cả'
      setListJobPosts(jobpostFilter); // Set lại danh sách jobpost ban đầu
    } else if (selectedMajor !== '') {
      const filteredPosts = jobpostFilter.filter((post) => { // Sử dụng allJobPosts thay vì listJobPosts để filter
        const jobmajor = post.major
        return jobmajor && jobmajor.includes(selectedMajor);
      });
      setListJobPosts(filteredPosts);
    } else {
      setListJobPosts(jobpostFilter); // Nếu không có giá trị được chọn, set lại danh sách jobpost ban đầu
    }
  };

  return (
    <div className={cx('container_full')}>
      <Helmet>
        <title>Trang chủ</title>
      </Helmet>
      <div className={cx('container')}>
        <div className={cx('search')}>
          <div className={cx('banner-div')}>
            <div className={cx('input-wrapper')}>
              <div className={cx('input-group')}>
                <FaSearch className={cx('search-icon')} />
                <input
                  id="job-search"
                  className={cx('input-search')}
                  placeholder="Nhập từ khóa, công việc"
                />
              </div>
              <div className={cx('input-group','city-search')}>
                <FaLocationArrow className={cx('search-icon')} />
                <input
                  id="location-search"
                  className={cx('input-search')}
                  placeholder="Nhập thành phố"
                />
              </div >
              <button className={cx('search-button')} onClick={handleSearch}>
                <FaSearch className={cx('search-icon')} />
                Tìm kiếm
              </button>
              <ToastContainer />
            </div>

          </div>
        </div>
      </div>

      <div className={cx('select-wrapper')}>
        <select className={cx('select')} onChange={handleFilter}>
          <option value="">Tất cả</option>
          {listmajor.map((major) => (
            <option key={major._id} value={major.namemajor}>
              {major.namemajor}
            </option>
          ))}
        </select>
      </div>

      <div className={cx('wrapper_jobpost')}>
        <div className={cx('jobpost')}>
          <ul className={cx('jobpost-preview')}>
            {currentPosts.splice(0, 20).map((jobPost, index) => (
              <div onClick={() => handleDetail(jobPost._id)} className={cx('jobpost-description')} key={index}>
                <div className={cx('logo')}>
                  <img src={jobPost.logo} />
                </div>
                <div className={cx('jobpost_detail')}>
                  <h2 >{jobPost.title}</h2>
                  <div className={cx('wrapper_content')}>
                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/dusk/64/null/organization.png" />
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
                  {/* <span style={{display:'block'}} className={cx('major-span')}>{jobPost.major}</span> */}
                </div>
                <div className={cx('action-div')} style={{ marginTop: '80px', padding: '10px' }}>
                  <button className={cx('apply_button')}>Ứng tuyển ngay</button>
                </div>
              </div>
            ))}
          </ul>

          <div className={cx('banner_right')}>
            <img src='https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages.vietnamworks.com%2Flogo%2F500x600_122601.png&w=1920&q=75' />
            <div>
              <img className={cx('img-2')} src='https://img.timviec.com.vn/2021/06/dang-tin-tuyen-dung-14.jpg' />
            </div>

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
      <button id="scroll-to-top-btn" className={cx('scroll-to-top-btn')} aria-label="Scroll to top">
        <FaArrowRight className={cx('scroll-icon')} />
      </button>


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