import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from './pageDetail.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import logoCompany from '../uploads/viettel.jpg'
const cx = classNames.bind(styles)


function PageDetail() {
  const [accounts, setAccount] = useState({})
  const [logo, setLogo] = useState()
  const [image, setImage] = useState(null);
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);


  const url = new URL(window.location.href);
  const idDetail = url.pathname.split('/').pop();
  const company_token = localStorage.getItem('user-save');
  useEffect(() => {
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
          setSelectedDate(new Date(account.expdate));
          setAccount(account);
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
      editButton.addEventListener("click", function () {
        if (isEditing) {
          document.getElementById('title').readOnly = true;
          document.getElementById('salary').readOnly = true;
          document.getElementById('location').readOnly = true;
          document.getElementById('gender').readOnly = true;
          document.getElementById('required').readOnly = true;
          document.getElementById('benefit').readOnly = true;
          document.getElementById('responsibility').readOnly = true;
          document.getElementById('skill').readOnly = true;
          document.getElementById('date').readOnly = true;
          isEditing = false;
        } else {
          document.getElementById('title').readOnly = false;
          document.getElementById('salary').readOnly = false;
          document.getElementById('location').readOnly = false;
          document.getElementById('gender').readOnly = false;
          document.getElementById('required').readOnly = false;
          document.getElementById('benefit').readOnly = false;
          document.getElementById('responsibility').readOnly = false;
          document.getElementById('skill').readOnly = false;
          document.getElementById('date').readOnly = false;
          isEditing = true;
        }
      });
    }
    else {
      console.log("Lỗi");
    }
    return () => {
      // remove event listener here
      if (editButton) {
        editButton.removeEventListener("click", function () {
          document.getElementById('title').readOnly = false;
          document.getElementById('salary').readOnly = false;
          document.getElementById('location').readOnly = false;
          document.getElementById('gender').readOnly = false;
          document.getElementById('required').readOnly = false;
          document.getElementById('benefit').readOnly = false;
          document.getElementById('responsibility').readOnly = false;
          document.getElementById('skill').readOnly = false;
          document.getElementById('date').readOnly = false;
        });
      }
    };
  }, []);
  function updateDetails() {
    // Lấy giá trị của input và DatePicker
    const title = document.getElementById("title").value;
    const salary = document.getElementById("salary").value;
    const location = document.getElementById("location").value;
    const gender = document.getElementById("gender").value;
    const benefit = document.getElementById("benefit").value;
    const responsibility = document.getElementById("responsibility").value;
    const required = document.getElementById("required").value;
    const skill = document.getElementById("skill").value;
    
    // const companyNameInput = document.getElementById("datepicker").value;

    // Lấy ID của company
    // Lấy ID của company từ đâu đó
    // Gọi API để cập nhật thông tin
    fetch(`http://localhost:5000/company/details/${idDetail}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        salary: salary,
        gender: gender,
        location: location,
        required: required,
        benefit: benefit,
        responsibility:responsibility,
        skill:skill,
        expdate: selectedDate
      })
    })
      .then(response => {
        if (response.ok) {
          // Thực hiện các hành động khác khi cập nhật thành công
        } else {
          // Thông báo lỗi nếu không thành công
        }
      })
      .catch(error => {
        // Xử lý lỗi nếu có
      });
  }
  return (
    <div className={cx('wrapper')} >
      <h1 >Detais_page</h1>
      <div className={cx('form-detail')}>
        <div className={cx('container')}>
          <div className={cx('logo-info')}>
            <img src={logoCompany} alt="Lỗi" />
          </div>
          <div className={cx('input-img')}>
            <label style={{ marginRight: '10px' }}>Date</label>
            <DatePicker
              id="date"
              selected={selectedDate}
              onChange={date => {
                setSelectedDate(date)
                updateDetails(date)}
              }
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày hết hạn"
            />
          </div>
        </div>
        <div className={cx('title_wrap')}>
          <label className={cx('label-des')}>Tên công ty</label>
          <input id="companyNameInput" disabled value={accounts.namecompany} className={cx('input-title')} />
        </div>

        <div className={cx('title_wrap')}>
          <label className={cx('label-des')}>Tiêu đề</label>
          <input id="title" className={cx('input-title')} readOnly value={accounts.title} onChange={(event) => setAccount({ ...accounts, title: event.target.value })} />
        </div>

        <div className={cx('wrapper-des')}>
          <div >
            <label className={cx('label-des-one')}>Địa chỉ</label>
            <input id="location" className={cx('input-des')} readOnly value={accounts.location} onChange={(event) => setAccount({ ...accounts, location: event.target.value })} />
          </div>
          <div >
            <label className={cx('label-des-one')}>Trợ cấp</label>
            <input id="salary" readOnly className={cx('input-des')} value={accounts.salary} onChange={(event) => setAccount({ ...accounts, salary: event.target.value })} />
          </div>
        </div>
        <div className={cx('wrapper-gen')}>
          <div >
            <label className={cx('label-des-one')}>Skill</label>
            <input id="skill" value={accounts.skill} readOnly className={cx('input-des')} onChange={(event) => setAccount({ ...accounts, skill: event.target.value })} />
          </div>
          <div >
            <label className={cx('label-des-one')} for="gender">Giới tính</label>
            <select readOnly value={accounts.gender} id="gender" name="gender">
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
        </div>
        <div className={cx('wrapper-ip')}>
          <label className={cx('label-des')} for="input-field">Phúc lợi thực tập</label>
          <textarea id="benefit" readOnly className={cx('input-res')} value={accounts.benefit} onChange={(event) => setAccount({ ...accounts, benefit: event.target.value })} />
        </div>
        <div className={cx('wrapper-ip')}>
          <label className={cx('label-des')} for="input-field">Trách nhiệm </label>
          <textarea id="responsibility" readOnly className={cx('input-res')} value={accounts.responsibility} onChange={(event) => setAccount({ ...accounts, responsibility: event.target.value })} />
        </div>
        <div className={cx('wrapper-ip')}>
          <label className={cx('label-des')} for="input-field">Yêu cầu</label>
          <textarea id="required" readOnly type="text" className={cx('input-res')} value={accounts.required} onChange={(event) => setAccount({ ...accounts, required: event.target.value })} />
        </div>
        <div className={cx('button-action-div')}>
          <button id={cx('edit-button')} className={cx('button-action')}>Chỉnh sửa</button>
          <button onClick={updateDetails} id={cx('button-update')} className={cx('button-action')}>Cập nhật</button>
        </div>
      </div>
    </div>

  );
}
export default PageDetail