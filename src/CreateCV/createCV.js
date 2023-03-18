import classNames from "classnames/bind";
import styles from './createCV.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import { useParams,useNavigate  } from "react-router-dom";
import { FaLocationArrow, FaMoneyBillAlt, FaCalendarDay, FaHeart } from 'react-icons/fa';

const cx = classNames.bind(styles)

function CreateCV() {
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
const [address, setAddress] = useState('');
const [education, setEducation] = useState('');
const [experience, setExperience] = useState('');

const handleSubmit = (e) => {
    e.preventDefault();
    // submit the form data to backend or do something else
    console.log({
      firstName,
      lastName,
      email,
      phone,
      address,
      education,
      experience
    });
  };

  return (
    <div className={cx('resumeBuilder')}>
      <h1>Resume Builder</h1>
      <form onSubmit={handleSubmit}>
        <div className={cx('formGroup')}>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className={cx('formGroup')}>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className={cx('formGroup')}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={cx('formGroup')}>
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className={cx('formGroup')}>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className={cx('formGroup')}>
          <label htmlFor="education">Education:</label>
          <textarea
            id="education"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          />
        </div>
        <div className={cx('formGroup')}>
          <label htmlFor="experience">Experience:</label>
          <textarea
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateCV;