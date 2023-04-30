import classNames from 'classnames/bind';
import styles from './company.module.scss'
import { FaAngleDoubleRight, FaAngleDoubleLeft, FaArrowRight, FaLocationArrow, FaSearch, FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import jwt_decode from "jwt-decode";
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import Select from 'react-select'


const cx = classNames.bind(styles)
function Company() {
  const [accounts, setAccount] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [originalJobPosts, setOriginalJobPosts] = useState([]);
  const [selectedValueCities, setSelectedValueCities] = useState([]);
  const [cities, setCities] = useState([]);
  const [listcompany, setListCompany] = useState([])


  const apilistCom = 'http://localhost:5000/listcompany'
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(apilistCom)
      result.json().then(json => {
        setListCompany(json);
        setOriginalJobPosts(json);
      })
    }
    fetchData();
  }, []);




  const cityapi = 'http://localhost:5000/listareas'
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(cityapi, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      result.json().then(json => {
        setCities(json);
      });
    };
    fetchData();
  }, []);


  const pageCount = Math.ceil(listcompany.length / postsPerPage);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = listcompany.slice(indexOfFirstPost, indexOfLastPost);


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

 
  const JobPostCount = listcompany.length;


  const handleDetail = (id) => {
    window.location.href = `/listcompany/${id}`
  }


  const handleSearch = () => {
    const inputJob = document.getElementById('job-search').value.toLowerCase();

    if (!inputJob && !selectedValueCities.length) {
      setListCompany(originalJobPosts);
      return;
    }

    const filteredPosts = originalJobPosts.filter((post) => {
      const nameCompany = post.namecompany.toLowerCase();
      const jobCity = post.location ? post.location.toLowerCase() : '';
      const matchCompany = nameCompany.includes(inputJob);
      const matchCity = selectedValueCities.length
        ? selectedValueCities.some((city) => jobCity.includes(city.value.toLowerCase()))
        : true;

      return matchCompany && matchCity;
    });

    setListCompany(filteredPosts);
  };


  const handleChangeCity = (selectedOptions) => {
    setSelectedValueCities(selectedOptions);
  };

  useEffect(() => {
    handleClear();

  }, [])
  const handleClear = () => {
    document.getElementById('job-search').value = '';
    setSelectedValueCities([]);
  }




  const optionSalary = [
    { value: 'all', label: 'Trợ cấp' },
    { value: '0-2Tr VND', label: '0-2Tr VND' },
    { value: '1Tr-3Tr VND', label: '1Tr-3Tr VND' },
    { value: '2Tr-4Tr VND', label: '2Tr-4Tr VND' },
    { value: '4Tr-6Tr VND', label: '4Tr-6Tr VND' },
    { value: '6Tr-10Tr VND', label: '6Tr-10Tr VND' },
    { value: 'Thương lượng', label: 'Thương lượng' },
    { value: 'Cạnh tranh', label: 'Cạnh tranh' },
  ]
  const optionsForm = [
    { value: 'all', label: 'Hình thức làm việc' },
    { value: 'Bán thời gian', label: 'Bán thời gian' },
    { value: 'Toàn thời gian', label: 'Toàn thời gian' },
  ]
  const optionsGender = [
    { value: 'all', label: 'Giới tính' },
    { value: 'Nam', label: 'Nam' },
    { value: 'Nữ', label: 'Nữ' },
    { value: 'Không yêu cầu', label: 'Không yêu cầu' },
  ]


  //   const data = citiesArray[1].data; // Lấy mảng dữ liệu từ phần tử thứ hai của response
  // const names = data.map(item => item.name); // Trích xuất cột 'name' từ mỗi phần tử trong mảng dữ liệu


  return (
    <div className={cx('container_full')}>
      <Helmet>
        <title>Trang chủ</title>
      </Helmet>
      <section className={cx('container')}>
        <div className={cx('input-wrapper')}>
          <div className={cx('input-group', 'job_search')}>
            <input
              id="job-search"
              className={cx('input-search')}
              placeholder="Nhập tên công ty ,..."
            />
          </div>
          <div className={cx('input-group', 'select-wrapper')}>
            <Select className={cx('select')}
              placeholder='Chọn thành phố'
              isMulti
              value={selectedValueCities}
              defaultValue={selectedValueCities}
              options={cities.map(city => ({ label: city.name, value: city.name }))}
              onChange={handleChangeCity}
            />
          </div>
          <button className={cx('search-button')} onClick={handleSearch}>
            <FaSearch className={cx('search-icon')} />
          </button>
        </div>
        <div className={cx('filter_wrapper_wrapper')}>
          <div className={cx('clear-Filter')}>
            <span className={cx('span-clear')} onClick={handleClear}>Xóa bộ lọc</span>
          </div>
        </div>

      </section>



      <div className={cx('wrapper_jobpost')}>
        <div className={cx('title_count')} style={{ marginTop: '80px' }} >
          <h2> {JobPostCount} công ty thực tập </h2>
        </div>
        <div className={cx('jobpost')}>
          <ul className={cx('jobpost-preview')}>
            {currentPosts.splice(0, 20).map((company, index) => (
              <div onClick={() => handleDetail(company._id)} className={cx('jobpost-description')} key={index}>
                <div className={cx('logo')}>
                  <div className={cx('wrapper-logo')}>
                    <img src={company.logo} />
                  </div>
                  <ToastContainer />
                </div>
                <div className={cx('jobpost_detail')}>
                  <h2 >{company.namecompany}</h2>
                  <div className={cx('wrapper_content')}>
                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/dusk/64/null/organization.png" />
                    <span className={cx('detail_span', 'company')}>  {company.emailcompany}</span>
                  </div>
                  <div className={cx('wrapper_content')}>
                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/officel/30/null/place-marker--v1.png" />
                    <span className={cx('detail_span', 'location')}>{company.phonecompany}</span>
                  </div>
                  <div className={cx('wrapper_content')}>
                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/ios/50/null/wallet--v1.png" />
                    <span className={cx('detail_span', 'salary')}>{company.slogan}</span>
                  </div>

                </div>
                <div className={cx('action-div')} style={{ marginTop: '80px', padding: '10px' }}>
                  <div className={cx('wrapper_content')}>
                    <span className={cx('detail_span', 'salary')}>{company.location}</span>
                  </div>
                  <button className={cx('apply_button')}>Xem chi tiết</button>
                </div>
              </div>
            ))}
          </ul>

          <div className={cx('banner_right')}>
            <img src='https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages.vietnamworks.com%2Flogo%2F500x600_122601.png&w=1920&q=75' />

            <img className={cx('img-2')} src='https://img.timviec.com.vn/2021/06/dang-tin-tuyen-dung-14.jpg' />


          </div>
          <div className={cx('paginate-wrapper', 'pagination')}>
            <ReactPaginate
              previousLabel={<FaChevronLeft />}
              nextLabel={<FaChevronRight />}
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
        {/* Hiển thị nút phân trang */}

      </div>




      {/* <div className={cx('wrapper')}>
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
      </div> */}

    </div >
  );

}

export default Company;