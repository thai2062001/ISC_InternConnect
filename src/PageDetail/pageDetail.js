import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from './pageDetail.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import SlidebarCompany from '../Component/Layout/SlidebarCompany'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot,faCoins ,faVenusMars  } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles)


function PageDetail() {
  const [accounts, setAccount] = useState({})
  const [logo, setLogo] = useState()
  const [image, setImage] = useState(null);
  const { id } = useParams();


  useEffect(() => {
    const url = new URL(window.location.href);
    const idDetail = url.pathname.split('/').pop();
    const company_token = localStorage.getItem('user-save');
    const companyApi = 'http://localhost:5000/company'
    const fetchData = async () => {
      const result = await fetch(companyApi, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${company_token}`
        },
      })
      result.json().then(json => {
        const account = json.find(item => item._id === idDetail);
        if (account) {
          setAccount(account);
          if (account.url) {
            setImage(account.url);
          }
        } else {
          console.error('Không tồn tại bài đăng có id này');
        }
      })
    }
    fetchData();
  }, []);
  useEffect(() => {

    return () => {
      logo && URL.revokeObjectURL(logo.preview)
      // logo && : nếu ko có logo để khởi tạo thì chạy cái thứ 2. Nếu đã có logo thì xóa đi để tránh rò rỉ
      //Dùng để xóa bỏ url preview ảnh ra khỏi bộ nhớ để tránh rò rỉ bộ nhớ
    }
  }, [logo])

  const handlePreviewLogo = (e) => {
    const file = e.target.files[0]

    file.preview = URL.createObjectURL(file)
    //URL.createObjectURL dùng để tạo Obj để trở thành 1 url để có thể xem tạm ảnh

    setLogo(file)
  }



  return (


    <div className={cx('wrapper')} >
      <div className={cx('container')}>
        <div className={cx('logo-info')}>
          <img src={accounts.url} />
          <h2>{accounts.title}</h2>
          <h3>{accounts.namecompany}</h3>
        </div>

        <div className={cx('input-img')}>
          <label style={{ marginRight: '10px' }}>Date</label>
          <p>{accounts.expdate}</p>
        </div>
      </div>
      <div className={cx('wrapper-ip')}>
        <div style={{display:'flex'}}>
        <FontAwesomeIcon icon={faLocationDot} color="#FFA3FD" size="lg"/>
        <p>{accounts.location}</p>
        </div>

        <div style={{display:'flex',marginTop:'10px'}}>
        <FontAwesomeIcon icon={faCoins}  color="#9DC08B" size="lg" />
        <p>{accounts.salary}</p>
        </div>
        <div style={{display:'flex',marginTop:'10px'}}>
        <FontAwesomeIcon icon={faVenusMars} color="#FDD36A" size="lg" />
        <p>{accounts.gender}</p>
        </div>

        
      </div>

      <div className={cx('wrapper-ip')}>
        <label className={cx('input-field')} for="input-field">Phúc lợi thực tập</label>
        <p>{accounts.required}</p>
      </div>
      <div className={cx('wrapper-ip')}>
        <label className={cx('input-field')} for="input-field">Trách nhiệm </label>
        <p>{accounts.required}</p>
      </div>
      <div className={cx('wrapper-ip')}>
        <label className={cx('input-field')} for="input-field">Kỹ năng</label>
        <p>{accounts.required}</p>
      </div>

    </div>
  );
}
export default PageDetail