import classNames from "classnames/bind";
import styles from './schoolManager.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import {  MenuItem, Select } from "@material-ui/core";


const cx = classNames.bind(styles)



function SchoolManager() {
    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [year, setYear] = useState('all')
    const [address, setAdress] = useState('all')
    const [gender, setGender] = useState('all')
    const [verify, setVerify] = useState('all')
    const [major, setMajor] = useState('all')

    useEffect(() => {
      if (year === 'all') {
        setFilteredAccounts(accounts);
      } else {
        setFilteredAccounts(accounts.filter(dt => dt.academicyear === year));
      }
    }, [year, accounts]);
  
    useEffect(() => {
      if (address === 'all') {
        setFilteredAccounts(accounts);
      } else {
        setFilteredAccounts(accounts.filter(dt => dt.address === address));
      }
    }, [address, accounts]);
  
    useEffect(() => {
      if (gender === 'all') {
        setFilteredAccounts(accounts);
      } else {
        setFilteredAccounts(accounts.filter(dt => dt.gender === gender));
      }
    }, [gender, accounts]);
    useEffect(() => {
      if (major === 'all') {
        setFilteredAccounts(accounts);
      } else {
        setFilteredAccounts(accounts.filter(dt => dt.major === major));
      }
    }, [major, accounts]);
  
    useEffect(() => {
      if (verify === 'all') {
        setFilteredAccounts(accounts);
      } else {
        setFilteredAccounts(accounts.filter(dt => dt.verify === verify));
      }
    }, [verify, accounts]);
  
  
    const columns = [
        { title: "ID", field: "code" , },
        { title: "Name", field: "studentname" , },
        { title: "Email", field: "studentemail" , },
        { title: "Phone", field: "studentphone" , },
        { title: "Year", field: "academicyear" , },
        { title: "Address", field: "address" , },
        { title: "Gender", field: "gender" , },
        { title: "Major", field: "major" , },
        { title: "School", field: "school" , },
        { title: "Verify", field: "verify" , },
      ]

      useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        console.log(decodeUser.username);
        console.log(decodeUser.email);
        setName(decodeUser.username)
    }, [])
    const school_token = localStorage.getItem('user-save');
    const URL = 'http://localhost:5000/uni'
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(URL,{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${school_token}`
                },
            })
            result.json().then(json => {
                setAccount(json)
            })
        }
        fetchData();
    }, []);

    return ( 
        <div className="App">
        <div className={cx('table-wrapper')}>
        <MaterialTable className = {cx('table')} 
        title="Account Data"
        data={filteredAccounts}
        columns={columns}
        actions={[
          {
            icon: () => <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{ width: 100 }}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <MenuItem value={'all'}><em>All</em></MenuItem>
              <MenuItem value={'2017'}>2017</MenuItem>
              <MenuItem value={'2018'}>2018</MenuItem>
              <MenuItem value={'2019'}>2019</MenuItem>
              <MenuItem value={'2020'}>2020</MenuItem>
              <MenuItem value={'2021'}>2021</MenuItem>
            </Select>,
            tooltip: "Filter Year",
            isFreeAction: true
          }
          ,{
            icon: () => <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            style={{ width: 100 }}
            value={address}
            onChange={(e) => setAdress(e.target.value)}
          >
            <MenuItem value={'all'}><em>All</em></MenuItem>
            <MenuItem value={'HCM'}>HCM</MenuItem>
            <MenuItem value={'Hà Nội'}>Hà Nội</MenuItem>
            <MenuItem value={'Hải Phòng'}>Hải Phòng</MenuItem>
            <MenuItem value={'Đà Nẵng'}>Đà Nẵng</MenuItem>
            <MenuItem value={'Huế'}>Huế</MenuItem>
          </Select>,
          tooltip: "Filter Address",
          isFreeAction: true

          }
          ,{
            icon: () => <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            style={{ width: 100 }}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <MenuItem value={'all'}><em>All</em></MenuItem>
            <MenuItem value={'Nam'}>Nam</MenuItem>
            <MenuItem value={'Nữ'}>Nữ</MenuItem>
            <MenuItem value={'Khác'}>Khác</MenuItem>
          </Select>,
          tooltip: "Filter Gender",
          isFreeAction: true
          }
        
        ]}
        options={{
          actionsColumnIndex: -1, addRowPosition: "first",
          headerStyle: {
            fontSize: '18px',
            width: '200px',
          },
        }}
      />
        </div>
      <link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
      </div>
     );
}

export default SchoolManager;