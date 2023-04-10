import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from './pageDetail.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'

const cx = classNames.bind(styles)


function PageDetail() {
  const [accounts, setAccount] = useState({})
  const [logo, setLogo] = useState()
  const [image, setImage] = useState(null);
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [listmajor, setListMajor] = useState([])
  const [cities, setCities] = useState([]);
  const [selectedValueCities, setSelectedValueCities] = useState('');

  const cityapi = 'http://localhost:5000/company/listareas'
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

  const handleChangeCity = (selectedOptions) => {
    setSelectedValueCities(selectedOptions.value);
  };

  const url = new URL(window.location.href);
  const idDetail = url.pathname.split('/').pop();
  const company_token = localStorage.getItem('user-save');




  const apiUrl = 'http://localhost:5000/company/listmajor'
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${company_token}`
        },
      });
      result.json().then(json => {
        setListMajor(json);
      });
    };
    fetchData();
  }, []);


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
          document.getElementById('salary').disabled = true;
          document.getElementById('location').readOnly = true;
          document.getElementById('gender').disabled = true;
          document.getElementById('wokingformInput').disabled = true;
          document.getElementById('placeInput').disabled = true;
          document.getElementById('required').readOnly = true;
          document.getElementById('benefit').readOnly = true;
          document.getElementById('responsibility').readOnly = true;
          document.getElementById('date').readOnly = true;
          document.getElementById('majorInput').disabled = true;
          isEditing = false;
        } else {

          document.getElementById('title').readOnly = false;
          document.getElementById('salary').disabled = false;
          document.getElementById('location').readOnly = false;
          document.getElementById('gender').disabled = false;
          document.getElementById('wokingformInput').disabled = false;
          document.getElementById('placeInput').disabled = false;
          document.getElementById('required').readOnly = false;
          document.getElementById('benefit').readOnly = false;
          document.getElementById('responsibility').readOnly = false;
          document.getElementById('date').readOnly = false;
          document.getElementById('majorInput').disabled = false;
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
          document.getElementById('wokingformInput').readOnly = false;
          document.getElementById('placeInput').disabled = false;
          document.getElementById('required').readOnly = false;
          document.getElementById('benefit').readOnly = false;
          document.getElementById('responsibility').readOnly = false;
          document.getElementById('date').readOnly = false;
        });
      }
    };
  }, []);
  function updateDetails() {
    // Lấy giá trị của input và DatePicker
    const title = document.getElementById("title").value;
    const major = document.getElementById("majorInput").value;
    const salary = document.getElementById("salary").value;
    const location = document.getElementById("location").value;
    const gender = document.getElementById("gender").value;
    const workingform = document.getElementById("wokingformInput").value;
    const place = document.getElementById("placeInput").value;
    const benefit = document.getElementById("benefit").value;
    const responsibility = document.getElementById("responsibility").value;
    const required = document.getElementById("required").value;
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
        place: place,
        major: major,
        salary: salary,
        gender: gender,
        location: location,
        workingform: workingform,
        required: required,
        benefit: benefit,
        responsibility: responsibility,
        expdate: selectedDate
      })
    })
      .then(response => {
        if (response.ok) {
          // Thực hiện các hành động khác khi cập nhật thành công
          toast.success('Đã cập nhật thông tin công ty!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          // Thông báo lỗi nếu không thành công
        }
      })
      .catch(error => {
        // Xử lý lỗi nếu có
      });
  }

  console.log(accounts.place);

  return (
    <div className={cx('wrapper')} >
      <div className={cx('form-detail')}>
        <div className={cx('container')}>
          <div className={cx('logo-info')}>
            <img src={accounts.logo} alt="Lỗi" />
          </div>

        </div>
        <div className={cx('wrapper-date-form')}>
          <div className={cx('input-img')}>
            <label className={cx('label-des')} >Date</label>
            <DatePicker className={cx('datepicker_info')}
              id="date"
              selected={selectedDate}
              onChange={date => {
                setSelectedDate(date)
                updateDetails(date)
              }
              }
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày hết hạn"
            />
          </div>
          <div className={cx('workingForm')}>
            <label className={cx('label-des')} for="workingform">Hình thức</label>
            <select className={cx('working-input')} disabled id="wokingformInput" name="workingform"> onChange={(e) => setAccount({ ...accounts, workingform: e.target.value })}
              <option value="Bán thời gian">Bán thời gian</option>
              <option value="Toàn thời gian">Toàn thời gian</option>
            </select>
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
          <div className={cx('place')}>
            <label className={cx('label-des')}>Khu vực</label>
            <select disabled id="placeInput" className={cx( 'place_input')} value={accounts.place} onChange={(e) => setAccount({ ...accounts, place: e.target.value })} >
              <option value="">Chọn khu vực</option>
              {cities.map(city => (
                <option key={city._id} value={city.name}>{city.name}</option>
              ))}
            </select>
          </div>
          <div className={cx('gender-wrapper')}>
            <label className={cx('label-des')} for="gender">Trợ cấp</label>
            <select id="salary" name="gender" disabled className={cx('salary-input')}> value={accounts.salary} disabled onChange={(event) => setAccount({ ...accounts, salary: event.target.value })}
              <option value="0-3Tr VND">0-2Tr VND</option>
              <option value="1Tr-3Tr VND">1Tr-3Tr VND</option>
              <option value="2Tr-4Tr VND">2Tr-4Tr VND</option>
              <option value="4Tr-6Tr VND">4Tr-6Tr VND</option>
              <option value="6Tr-10Tr VND">6Tr-10Tr VND</option>
              <option value="Thương lượng">Thương lượng</option>
              <option value="Cạnh tranh">Cạnh tranh</option>
            </select>

          </div>
        </div>

        <div>
          <div className={cx('detail-location')} >
            <label className={cx('label-des')}>Địa chỉ chi tiết</label>
            <input id="location" className={cx('input_location')} readOnly value={accounts.location} onChange={(event) => setAccount({ ...accounts, location: event.target.value })} />
          </div>
        </div>

        <ToastContainer style={{ width: '400px' }} />

        <div className={cx('wrapper-gen')}>
          <div  className={cx('gender_wrapper')}>
            <label className={cx('label-des')} for="gender">Giới tính</label>
            <select disabled value={accounts.gender} className={cx('input-des')} id="gender" name="gender" onChange={(e) => setAccount({ ...accounts, gender: e.target.value })}>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Không yêu cầu">Không yêu cầu</option>
            </select>
          </div>


          <div className={cx('major_wrapper')}>
            <label className={cx('label-des')}>Ngành nghề</label>
            <select disabled id="majorInput" className={cx('input_major')} value={accounts.major} onChange={(e) => setAccount({ ...accounts, major: e.target.value })} >
              <option value="">Chọn ngành nghề</option>
              {listmajor.map(major => (
                <option key={major._id} value={major.namemajor}>{major.namemajor}</option>
              ))}
            </select>
          </div>

        </div>
        <div className={cx('wrapper-ip')}>
          <label className={cx('label-des')} for="input-field">Phúc lợi thực tập</label>
          <textarea id="benefit" readOnly className={cx('input-res')} value={accounts.benefit} onChange={(event) => setAccount({ ...accounts, benefit: event.target.value })} />
        </div>
        <div className={cx('wrapper-ip')}>
          <label className={cx('label-des')} for="input-field">Mô tả công việc </label>
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