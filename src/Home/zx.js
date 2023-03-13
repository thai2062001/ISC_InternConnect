import classNames from 'classnames/bind';
import styles from './Home.module.scss'
import { FaAngleDoubleRight, FaAngleDoubleLeft, FaArrowRight, FaLocationArrow, FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import bannerimages from '../images/banner.PNG'


const cx = classNames.bind(styles)
function Home() {
  const [accounts, setAccount] = useState([])
  const [listJobPosts, setListJobPosts] = useState([])

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
        setListJobPosts(Object.values(json));
      })
    }
    fetchData();
  }, []);

  const HandleNext = () => {
    let lists = document.querySelectorAll('#item');
    document.getElementById('slide').appendChild(lists[0]);
  }

  const HandlePrev = () => {
    let lists = document.querySelectorAll('#item');
    document.getElementById('slide').prepend(lists[lists.length - 1]);
  }

  return (
    <div className={cx('container_full')}>
      <div className={cx('container')}>

        <div className={cx('search')}>
          <div className={cx('search-banner')}>
            <div className={cx('banner-wrapper')}>
              <img src='https://dxwd4tssreb4w.cloudfront.net/images/common/background-cover/careerlink_engineering_office.jpg' className={cx('banner-img')} />
            </div>
            <div className={cx('banner-wrapper-search')}>
              <h1>Tìm việc nhanh chóng, dễ dàng</h1>
              <div className={cx('banner-div')}>
                <div className={cx('input-1')}>
                  <FaSearch className={cx('seach-icon')} />
                  <input placeholder='Nhập từ khóa,Công việc' />
                </div>
                <div className={cx('input-2')}>
                  <FaLocationArrow className={cx('seach-icon')} />
                  <input placeholder='Nhập thành phố' />
                </div>
                <div className={cx('search-button')}>
                  <FaSearch className={cx('seach-icon-button')} />
                  <button>Tìm kiếm</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cx('jobpost')}>
          <div className={cx('jobpost-title')}>
            <span>Thực tập hấp dẫn</span>
            <ul className={cx('jobpost-preview')}>
              {listJobPosts.map((jobPost,index) => (
               <div key={index}>
               <p >{jobPost.title}</p>
               <p >{jobPost.benefit}</p>
               <p >{jobPost.location}</p>
             </div>
              ))}
            </ul>
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
    </div>
  );

}

export default Home;