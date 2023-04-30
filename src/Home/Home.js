import classNames from 'classnames/bind';
import styles from './Home.module.scss'
import { FaAngleDoubleRight, FaAngleDoubleLeft, FaArrowRight, FaLocationArrow, FaSearch, FaHeart ,FaChevronLeft,FaChevronRight} from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';
import jwt_decode from "jwt-decode";
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import Select from 'react-select'


const cx = classNames.bind(styles)
function Home() {
  const [accounts, setAccount] = useState([])
  const [listJobPosts, setListJobPosts] = useState([])
  const [jobpostSearch, setJobPostSearch] = useState([])
  const [jobpostFilter, setJobPostFilter] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [listmajor, setListMajor] = useState([])
  const [originalJobPosts, setOriginalJobPosts] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedValueCities, setSelectedValueCities] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState('');
  const [selectedWorkForm, setSelectedWorkForm] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [cities, setCities] = useState([]);


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


  const JobPostCount = listJobPosts.length;


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
  const handleFilterDetails = (major) => {
    window.location.href = `/${major}`
  }

  function formatDate(dateString) {
    const date = moment(dateString);
    const today = moment().startOf('day');
    const daysAgo = today.isSame(date, 'd') ? 'Hôm nay' : moment().diff(date, 'days') + ' ngày trước';
    return daysAgo;
  }

  const handleSearch = () => {
    const inputJob = document.getElementById('job-search').value.toLowerCase();

    if (!inputJob && !selectedValueCities.length && !selectedValues.length && !selectedSalary && !selectedWorkForm && !selectedGender) {
      setListJobPosts(originalJobPosts);
      return;
    }

    const filteredPosts = originalJobPosts.filter((post) => {
      const jobTitle = post.title.toLowerCase();
      const jobMajor = post.major;
      const jobCity = post.location;
      const jobSalaryRange = post.salary;
      const jobWorkForm = post.workingform;
      const jobGender = post.gender;
      const matchMajor = selectedValues.length ? selectedValues.some((major) => jobMajor && jobMajor.includes(major.value)) : true;
      const matchCity = selectedValueCities.length ? selectedValueCities.some((city) => jobCity && jobCity.includes(city.value)) : true;

      const matchSalaryRange = selectedSalary && selectedSalary.value !== 'all' ? jobSalaryRange === selectedSalary.value : true;
      const matchWorkForm = selectedWorkForm && selectedWorkForm.value !== 'all' ? jobWorkForm === selectedWorkForm.value : true;
      const matchGender = selectedGender && selectedGender.value !== 'all' ? jobGender === selectedGender.value : true;

      if (inputJob && matchMajor && matchCity && matchSalaryRange && matchWorkForm && matchGender) {
        return jobTitle.includes(inputJob.toLowerCase());
      } else if (inputJob && matchMajor && matchSalaryRange && matchWorkForm && matchGender) {
        return jobTitle.includes(inputJob.toLowerCase());
      } else if (matchMajor && matchCity && matchSalaryRange && matchWorkForm && matchGender) {
        return true;
      } else if (matchMajor && matchCity && inputJob === '' && matchSalaryRange && matchWorkForm && matchGender) {
        return true;
      } else if (matchMajor && matchCity && matchSalaryRange && inputJob === '' && matchWorkForm && matchGender) {
        return true;
      } else if (matchMajor && matchCity && matchSalaryRange && matchWorkForm && inputJob === '' && matchGender) {
        return true;
      } else if (matchMajor && matchCity && matchSalaryRange && matchWorkForm && matchGender && selectedValues.length) {
        return selectedValues.every((major) => jobMajor && jobMajor.includes(major));
      } else if (matchMajor && matchCity && matchSalaryRange && matchWorkForm && matchGender && selectedValueCities.length) {
        return selectedValueCities.every((city) => jobCity && jobCity.includes(city));
      }

      return false;
    });
    setListJobPosts(filteredPosts);
  };
  const handleSalary = (selectedOptions) => {
    setSelectedSalary(selectedOptions);
    if (selectedOptions.value === 'all') {
      return;
    }
  };
  const handleWorkForm = (selectedOptions) => {
    setSelectedWorkForm(selectedOptions);
    if (selectedOptions.value === 'all') {
      return;
    }
  };
  const handleGender = (selectedOptions) => {
    setSelectedGender(selectedOptions);
    if (selectedOptions.value === 'all') {
      return;
    }
  };


  const handleSelectChange = (selectedOptions) => {
    setSelectedValues(selectedOptions);
  };

  const handleChangeCity = (selectedOptions) => {
    setSelectedValueCities(selectedOptions);
  };

  useEffect(() => {
    handleClear();

  }, [])
  const handleClear = () => {
    document.getElementById('job-search').value = '';
    setSelectedValues([]);
    setSelectedValueCities([]);
    setSelectedSalary('');
    setSelectedWorkForm('');
    setSelectedGender('');
    setListJobPosts(originalJobPosts);

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

  const handleCompany = (companyLink) => {
    // const path = `/listcompany/${id}`
    // navigate(path)
    // window.location.href = path
    const jobpost_token = localStorage.getItem('user');
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
                const path = `/listcompany/${company._id}`
                window.location.href = path
            } else {
                console.error('Không tồn tại công ty có tên này');
            }
        })
    }
    fetchData();
}

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
              placeholder="Nhập từ khóa, công việc"
            />
          </div>
          <div className={cx('input-group', 'select-wrapper','major_select')}>
            <Select id='major_id' className={cx('select')} placeholder='Tất cả ngành nghề'
              isMulti
              value={selectedValues}
              defaultValue={selectedValues}
              options={listmajor.map(major => ({ label: major.namemajor, value: major.namemajor }))}
              onChange={handleSelectChange}
            />
          </div>
          <div className={cx('input-group', 'select-wrapper','city_select')}>
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
          <div className={cx('select-wrapper_filter')}>
            <Select id='salary' className={cx('select_filter','salary')} placeholder='Trợ cấp'
              options={optionSalary}
              value={selectedSalary}
              defaultValue={selectedSalary}
              clearable={false}
              onChange={handleSalary}
            />
          </div>
          <div className={cx('select-wrapper_filter')}>
            <Select className={cx('select_filter')} placeholder='Hình thức'
              options={optionsForm}
              onChange={handleWorkForm}
              value={selectedWorkForm}
              defaultValue={selectedWorkForm}
            />
          </div>
          <div className={cx('select-wrapper_filter')}>
            <Select className={cx('select_filter')} placeholder='Giới tính'
              options={optionsGender}
              onChange={handleGender}
              value={selectedGender}
              defaultValue={selectedGender}
            />
          </div>
          <div className={cx('clear-Filter')}>
            <span className={cx('span-clear')} onClick={handleClear}>Xóa bộ lọc</span>
          </div>
        </div>
      </section>

      <div className={cx('wrapper_jobpost')}>
        <div className={cx('title_count')} style={{ marginTop: '80px' }} >
          <h2> {JobPostCount} việc làm thực tập </h2>
        </div>
        <div className={cx('jobpost')}>
          <ul className={cx('jobpost-preview')}>
            {currentPosts.splice(0, 20).map((jobPost, index) => (
              <div  className={cx('jobpost-description')} key={index}>
                <div onClick={() => handleDetail(jobPost._id)} className={cx('logo')}>
                  <div className={cx('wrapper-logo')}>
                    <img src={jobPost.logo} />
                  </div>
                  <ToastContainer />
                </div>
                <div className={cx('jobpost_detail')}>
                  <h2  onClick={() => handleDetail(jobPost._id)} >{jobPost.title}</h2>
                  <div className={cx('wrapper_content')}>
                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/dusk/64/null/organization.png" />
                    <span onClick={()=>handleCompany(jobPost.namecompany)} className={cx('detail_span', 'company')}>  {jobPost.namecompany}</span>
                  </div>
                  <div className={cx('wrapper_content')}>
                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/officel/30/null/place-marker--v1.png" />
                    <span className={cx('detail_span', 'location')}>{jobPost.location}</span>
                  </div>
                  <div className={cx('wrapper_content')}>
                    <img style={{ width: '20px', height: '20px' }} src="https://img.icons8.com/ios/50/null/wallet--v1.png" />
                    <span className={cx('detail_span', 'salary')}>{jobPost.salary}</span>
                  </div>

                  {/* <div onClick={()=>handleFilterDetails(jobPost.major)}>
                  <span style={{display:'block'}} className={cx('major-span')}>{jobPost.major}</span>
                  </div> */}
                </div>
                <div className={cx('action-div')} style={{ marginTop: '80px', padding: '10px' }}>
                  <div className={cx('wrapper_date')}>
                    <span> Hình thức: {jobPost.workingform}</span>
                  </div>
                  <div className={cx('wrapper_date')}>
                    <span> Cập nhật: {formatDate(jobPost.DateSubmitted)}</span>
                  </div>    
                  <button onClick={() => handleDetail(jobPost._id)} className={cx('apply_button')}>Xem chi tiết</button>
                  
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
              nextLabel={<FaChevronRight/>}
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

export default Home;