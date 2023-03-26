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
      const filteredAccounts = accounts.filter(account => {
        if (year !== 'all' && account.academicyear !== year) {
          return false;
        }
        if (address !== 'all' && account.address !== address) {
          return false;
        }
        if (gender !== 'all' && account.gender !== gender) {
          return false;
        }
        if (verify !== 'all' && account.verify !== verify) {
          return false;
        }
        if (major !== 'all' && account.major !== major) {
          return false;
        }
        return true;
      });
      setFilteredAccounts(filteredAccounts);
    }, [accounts, year, address, gender, verify, major]);
  
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
        setName(decodeUser.username)
    }, [])
    const school_token = localStorage.getItem('user-save');
    const URL = 'http://localhost:5000/uni';
    
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${school_token}`
                },
            });
            const data = await result.json();
    
            // Tìm tất cả các object có trường "school" bằng với biến "name"
            const targetObjects = data.filter(obj => obj.school === name);
    
            // Gán dữ liệu vào state "account"
            setAccount(targetObjects);
        };
        fetchData();
    }, [name]);


     // Ham logout ve trang homelogin
    function handleLogOutUser() {
      localStorage.removeItem('user-save');
      window.location.href = '/login'
  }


  const token = localStorage.getItem('user-save');
  const decodeEmail = jwt_decode(token);
  const emailUser = decodeEmail.email;


    return ( 
        <div className="App">
        <div className={cx('wrapper')}>
        <h1 align="center">Trang quản lý Admin</h1>
        <div className={cx('user_log')}>
          <h2 className={cx('name_set')}>{name}</h2>
        </div>
        </div>
        
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
          ,{
            icon: () => <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            style={{ width: 100 }}
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          >
            <MenuItem value={'all'}><em>All</em></MenuItem>
            <MenuItem value={'Công nghệ thông tin'}>Công nghệ thông tin</MenuItem>
            <MenuItem value={'Kế toán'}>Kế toán</MenuItem>
            <MenuItem value={'Quản trị kinh doanh'}>Quản trị kinh doanh</MenuItem>
            <MenuItem value={'Quản trị khách sạn'}>Quản trị khách sạn</MenuItem>
            <MenuItem value={'Du lịch lữ hành'}>Du lịch lữ hành</MenuItem>
          </Select>,
          tooltip: "Filter Major",
          isFreeAction: true
          },
          {
            icon: () => <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{ width: 100 }}
              value={verify}
              onChange={(e) => setVerify(e.target.value)}
            >
              <MenuItem value={'all'}><em>All</em></MenuItem>
              <MenuItem value={true}>True</MenuItem>
              <MenuItem value={false}>False</MenuItem>
            </Select>,
            tooltip: "Filter Verify",
            isFreeAction: true
          }
        ]}
        editable={{
          
          onRowUpdate: (newData, oldData) => new Promise((resolve, reject) => {
            const id = oldData._id;
            const token_update = localStorage.getItem('user-save');
            fetch(`http://localhost:5000/uni/details/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token_update}`
              },
              body: JSON.stringify(newData)
            })
            .then(response => {
              if (response.ok) {
                const updatedRows = [...accounts];
                const index = updatedRows.findIndex(row => row.id === oldData.id);
                updatedRows[index] = { ...newData, id: oldData.id };
                setTimeout(() => {
                  setAccount(updatedRows);
                  window.location.reload();
                  resolve();
                }, 2000);
              } else {
                throw new Error(response.statusText);
              }
            })
            .catch(error => {
              console.error(error);
              reject(error);
            });
          }),

        }}
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