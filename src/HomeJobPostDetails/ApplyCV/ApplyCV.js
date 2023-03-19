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
  const [title, setTitle] = useState("");
  const cvInputRef = useRef(null);

  useEffect(() => {
    setDate(props.expdate);
    setName(props.username);
    setMajor(props.major);
    setEmail(props.email);
    setnameCompany(props.company);
    setNameSchool(props.school);
    setTitle(props.title)
  }, []);
  const handleApply = () => {
    const cvFile = cvInputRef.current.files[0];
        const formData = new FormData();
        formData.append("date", date);
        formData.append("email", email);
        formData.append("title", title);
        formData.append("name", name);
        formData.append("major", major);
        formData.append("nameschool", nameschool);
        formData.append("namecompany", namecompany);
        formData.append("cv", cvFile);
    
        fetch("http://localhost:5000/create", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            toast.success('Sucess!', {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
          });
            
          })
          .catch((error) => {
            // xử lý lỗi
          });
  };

  const handleOnClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  return (
    <div className={cx("ApplyCV")}>
      <div className={cx("ApplyCV_content")}>
        <h1>Ứng tuyển [{title}]</h1>
        <span className={cx("close")} onClick={handleOnClose}>
          &times;
        </span>
        <form type = "submit">
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
          <input type="file" name="CV" id="CV" ref={cvInputRef} />
          <button type="submit" onClick={handleApply}>
            Gửi
          </button>
          <ToastContainer/>
        </form>
      </div>
    </div>
  );
}

export default ApplyCV;