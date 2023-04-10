import classNames from 'classnames/bind';
import styles from './studentName.module.scss'
import { FaAngleDoubleRight, FaAngleDoubleLeft, FaArrowRight, FaLocationArrow, FaSearch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const cx = classNames.bind(styles)
function StudentName(props) {

  const [studentName, setStudentName] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [Code, setCode] = useState("");
  const [Major, setMajor] = useState("");
  const [School, setSchool] = useState("");
  const [cities, setCities] = useState([]);
  const [listMajor, setListMajor] = useState([]);
  const [school, setListSchool] = useState([]);



  const jobpost_token = localStorage.getItem('user');
  const decodeEmail = jwt_decode(jobpost_token);


  useEffect(() => {
    setStudentName(props.name)
    setGender(props.gender)
    setAddress(props.address)
    setCode(props.code)
    setMajor(props.major)
    setSchool(props.school)

  }, [])
  useEffect(() => {
    const fecthData = async () => {
      const response = await fetch("http://localhost:5000/admin/school");
      const newData = await response.json();
      setListSchool(newData);
    }
    fecthData();
  }, [])


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


  const handleClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  const handleChangeInfo = async (event) => {
    event.preventDefault();
    const URL = 'http://localhost:5000/update-profile'
    const info_token = localStorage.getItem('user');

    const data = {
      studentname: studentName,
      gender: gender,
      address: address,
      code: Code,
      major: Major,
      school: School,
    };

    try {
      const response = await fetch(URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${info_token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong!');
      }

      const result = await response.json();
      toast.success('Cập nhật thông tin thành công!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log(error);
      toast.error(error.message || 'Failed to change Info!');
    }
  }
const handleEdit= (event)=>{
  event.preventDefault();

    const editButton = document.querySelector('#edit-button');
    let isEditing = false;
    if (editButton) {
      editButton.addEventListener("click", function () {
        if (isEditing) {

          document.getElementById('name').readOnly = true;
          document.getElementById('Address').disabled = true;
          document.getElementById('gender').disabled = true;
          document.getElementById('school').disabled = true;
          document.getElementById('major').disabled = true;
          document.getElementById('Code').readOnly = true;
          isEditing = false;
        } else {

          document.getElementById('name').readOnly = false;
          document.getElementById('Address').disabled = false;
          document.getElementById('gender').disabled = false;
          document.getElementById('school').disabled = false;
          document.getElementById('major').disabled = false;
          document.getElementById('Code').readOnly = false;
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
          document.getElementById('name').readOnly = false;
          document.getElementById('Address').disabled = false;
          document.getElementById('gender').disabled = false;
          document.getElementById('school').disabled = false;
          document.getElementById('major').disabled = false;
          document.getElementById('Code').readOnly = false;
        });
      }
    };
  };


  return (
    <div>
      (
      <div className={cx('change-password-container')}>
        <button className={cx('close-button')} onClick={handleClose}>
          X
        </button>

        <form className={cx('change-password-form')}>
          <h2>Cập nhật thông tin cá nhân</h2>
          <div className={cx('wrapper')}>
            <div className={cx('input-div')}>
              <label htmlFor="studentName"> Họ tên:</label>
              <input
                className={cx('pass_input')}
                type="text"
                id="name"
                value={studentName}
                onChange={(event) => setStudentName(event.target.value)}
                required
              />
            </div>
            <div className={cx('input-div')}>
              <label htmlFor="gender">Chọn giới tính:</label>
              <select disabled className={cx('pass_input')} id="gender" value={gender} onChange={(event) => setGender(event.target.value)}>
                <option value="">--Giới tính--</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div className={cx('input-div')}>
              <label >Địa điểm</label>
              <select disabled id="Address" className={cx('pass_input')} value={address} required onChange={(event) => setAddress(event.target.value)} >
                <option value="">Chọn Địa điểm</option>
                {cities.map(city => (
                  <option key={city._id} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>

            <div className={cx('input-div')}>
              <label htmlFor="Code"> MSSV:</label>
              <input
                readOnly
                className={cx('pass_input')}
                type="text"
                id="Code"
                value={Code}
                onChange={(event) => setCode(event.target.value)}
                required
              />
            </div>

            <div className={cx('input-div')}>
              <label >Ngành nghề</label>
              <select disabled id="major" className={cx('pass_input')} value={Major} required onChange={(event) => setMajor(event.target.value)} >
                <option value="">Chọn ngành nghề</option>
                {listMajor.map(major => (
                  <option key={major._id} value={major.namemajor}>{major.namemajor}</option>
                ))}
              </select>
            </div>
            <div className={cx('input-div')}>
              <label htmlFor="Code"> School:</label>
              <select disabled id="school" className={cx('pass_input')} value={School} required onChange={(event) => setSchool(event.target.value)}>
                <option value="">Chọn Trường</option>
                {school.map(schoolItem => (
                  <option key={schoolItem._id} value={schoolItem.nameschool}>{schoolItem.nameschool}</option>
                ))}
              </select>
            </div>



          </div>
          <div className={cx('action_buttons')}>
            <button onClick={handleEdit} id='edit-button' className={cx('submit_button')}>Chỉnh sửa</button>
            <button onClick={handleChangeInfo} className={cx('submit_button')} type="submit">Lưu thay đổi</button>

          </div>


        </form>
      </div>
      )
    </div>
  );
}

export default StudentName;