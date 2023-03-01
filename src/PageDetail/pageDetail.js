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

  useEffect(() => {
    const editButton = document.querySelector('#edit-button');
    let isEditing = false;
    if (editButton) {
      editButton.addEventListener("click", function() {
        if (isEditing) {
          document.getElementById('re-data').readOnly=true;
          document.getElementById('data').readOnly=true;
          document.getElementById('salary').readOnly=true;
          document.getElementById('difi').readOnly=true;
          document.getElementById('required').readOnly=true;
          document.getElementById('required1').readOnly=true;
          document.getElementById('required2').readOnly=true;
          isEditing = false;
        } else {
          document.getElementById('re-data').readOnly=false;
          document.getElementById('data').readOnly=false;
          document.getElementById('salary').readOnly=false;
          document.getElementById('difi').readOnly=false;
          document.getElementById('required').readOnly=false;
          document.getElementById('required1').readOnly=false;
          document.getElementById('required2').readOnly=false;
          isEditing = true;
        }
      });
    }
    else{
      console.log("Lỗi");
    }

    let isDataChanged = false;
    document.querySelectorAll("input").forEach(function(input) {
      input.addEventListener("change", function() {
        isDataChanged = true;
      });
    });
  
    return () => {
      // remove event listener here
      if (editButton) {
        editButton.removeEventListener("click", function() {
          document.getElementById('re-data').readOnly=false;
          document.getElementById('data').readOnly=false;
          document.getElementById('salary').readOnly=false;
          document.getElementById('difi').readOnly=false;
          document.getElementById('required').readOnly=false;
          document.getElementById('required1').readOnly=false;
          document.getElementById('required2').readOnly=false;
        });
      }
    };
  }, []);
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
          <input id="re-data" className={cx('input-title')} readOnly value={accounts.title} onChange={(event) => setAccount({...accounts, title: event.target.value})}/>
        </div>

        <div className={cx('wrapper-des')}>
          <div >
            <label className={cx('label-des-one')}>Địa chỉ</label>
            <input id="data" className={cx('input-des')} readOnly  value={accounts.location} onChange={(event) => setAccount({...accounts, location: event.target.value})} />
          </div>
          <div >
            <label className={cx('label-des-one')}>Trợ cấp</label>
            <input id="salary" readOnly className={cx('input-des')}value={accounts.salary} onChange={(event) => setAccount({...accounts, salary: event.target.value})} />
          </div>
        </div>
        <div className={cx('wrapper-gen')}>
          <div >
            <label className={cx('label-des-one')}>Khác</label>
            <input id="difi" readOnly className={cx('input-des')} value={accounts.salary} onChange={(event) => setAccount({...accounts, salary: event.target.value})} />
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
          <input id="required" readOnly className={cx('input-res')} value={accounts.required} onChange={(event) => setAccount({...accounts, required: event.target.value})} />
        </div>
        <div className={cx('wrapper-ip')}>
          <label className={cx('label-des')} for="input-field">Trách nhiệm </label>
          <input id="required1" readOnly className={cx('input-res')} value={accounts.required} onChange={(event) => setAccount({...accounts, required1: event.target.value})} />
        </div>
        <div className={cx('wrapper-ip')}>
          <label className={cx('label-des')} for="input-field">Kỹ năng</label>
          <input id="required2" readOnly type="text" className={cx('input-res')} value={accounts.required} onChange={(event) => setAccount({...accounts, required2: event.target.value})} />
        </div>
        <div className={cx('button-action-div')}>
        <button  id={cx('edit-button')} className={cx('button-action')}>Chỉnh sửa</button>
        <button onSubmit="submit"  id={cx('edit-update')} className={cx('button-action')}>Cập nhật</button>
        </div>
       
      </div>

    </div>

  );
}
export default PageDetail