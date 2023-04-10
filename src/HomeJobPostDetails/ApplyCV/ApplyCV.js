import classNames from "classnames/bind";
import styles from "./ApplyCV.module.scss";
import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);

function ApplyCV(props) {
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [major, setMajor] = useState("");
  const [email, setEmail] = useState(props.initialEmail || "");
  const [namecompany, setnameCompany] = useState("");
  const [nameschool, setNameSchool] = useState("");
  const [logo, setLogo] = useState("");
  const [title, setTitle] = useState("");
  const [ID, setID] = useState("");
  const cvInputRef = useRef(null);

  useEffect(() => {
    setDate(props.expdate);
    setName(props.username);
    setMajor(props.major);
    setEmail(props.email);
    setLogo(props.logo);
    setnameCompany(props.company);
    setNameSchool(props.school);
    setTitle(props.title)
    setID(props.id_post)
  }, []);
  const handleApply = (event) => {
    event.preventDefault()
    const cvFile = cvInputRef.current.files[0];
    const formData = new FormData();
    formData.append("date", date);
    formData.append("email", email);
    formData.append("title", title);
    formData.append("name", name);
    formData.append("logo", logo);
    formData.append("major", major);
    formData.append("nameschool", nameschool);
    formData.append("namecompany", namecompany);
    formData.append("id_post", ID);
    formData.append("cv", cvFile);

    fetch("http://localhost:5000/create", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success('Ứng tuyển thành công!');
        handleOnClose(); // đóng popup sau khi thực hiện xong
      })
      .catch((error) => {
        // xử lý lỗi
      });
  };
  const handleOnSubmit = (event) => {
    event.preventDefault();
    handleApply();
    props.onClose();
  }

  const handleOnClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  return (
    <div className={cx("ApplyCV")}>
      <div className={cx("ApplyCV_content")}>
        <h1 className={cx('h1_title')}>Ứng tuyển [{title}]</h1>
        <span className={cx("close")} onClick={handleOnClose}>
          &times;
        </span>
        <form onSubmit={handleApply}>
          <label htmlFor="Email">Email:</label>
          <input
            className={cx("email-input")}
            value={email}
            disabled
            type="email"
            name="Email"
            id="Email"
          />

          <label htmlFor="CV">Hồ sơ xin việc *</label>
          <div className={cx('file-type')}>
            <img src="https://icons.veryicon.com/png/o/education-technology/edit-job-operator/extract-2.png"/> 
            <input className={cx('choose-file')} type="file" name="CV" id="CV" ref={cvInputRef} />
          </div>
          <button type="submit" >
            Gửi
          </button>
          <ToastContainer />
        </form>
      </div>
    </div>
  );
}

export default ApplyCV;