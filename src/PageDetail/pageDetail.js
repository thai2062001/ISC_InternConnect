import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from './pageDetail.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import SlidebarCompany from '../Component/Layout/SlidebarCompany'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faCoins, faVenusMars } from '@fortawesome/free-solid-svg-icons';
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
      <h1 >Detais_page</h1>
      <div className={cx('form-detail')}>
        <div className={cx('container')}>
          <div className={cx('logo-info')}>
            <img src={accounts.url} />
            <h3>{accounts.namecompany}</h3>
          </div>

          <div className={cx('input-img')}>
            <label style={{ marginRight: '10px' }}>Date</label>
            <p>{accounts.expdate}</p>
          </div>
        </div>

        <div className={cx('title_wrap')}>
          <label className={cx('label-des')}>Tiêu đề</label>
          <input className={cx('input-title')} value={accounts.title} />
        </div>

        <div className={cx('wrapper-des')}>
          <div >
            <label className={cx('label-des-one')}>Địa chỉ</label>
            <input className={cx('input-des')} value={accounts.location} />
          </div>
          <div >
            <label className={cx('label-des-one')}>Trợ cấp</label>
            <input className={cx('input-des')} value={accounts.salary} />
          </div>
        </div>
        <div className={cx('wrapper-gen')}>
          <div >
            <label className={cx('label-des-one')}>Khác</label>
            <input className={cx('input-des')} value={accounts.salary} />
          </div>
          <div >
            <label className={cx('label-des-one')} for="gender">Giới tính</label>
            <select id="gender" name="gender">
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>


        <div className={cx('wrapper-ip')}>
          <label className={cx('label-des')} for="input-field">Phúc lợi thực tập</label>
          <input className={cx('input-res')} value={accounts.required} />
        </div>
        <div className={cx('wrapper-ip')}>
          <label className={cx('label-des')} for="input-field">Trách nhiệm </label>
          <input className={cx('input-res')} value={accounts.required} />
        </div>
        <div className={cx('wrapper-ip')}>
          <label className={cx('label-des')} for="input-field">Kỹ năng</label>
          <input type="text" className={cx('input-res')} value={accounts.required} />
        </div>
      </div>

    </div>
  );
}
export default PageDetail