import classNames from "classnames/bind";
import styles from './allJobPost.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import { Tooltip } from "bootstrap";
import {  MenuItem, Select } from "@material-ui/core";
const cx = classNames.bind(styles)


function AllJobPost() {
    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])

    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [company, setCompany] = useState('all')
    const [location, setLocation] = useState('all')

    useEffect(() => {
        const filteredAccounts = accounts.filter(account => {
          if (company !== 'all' && account.namecompany !== company) {
            return false;
          }
          if (location !== 'all' && account.location !== location) {
            return false;
          }
          return true;
        });
        setFilteredAccounts(filteredAccounts);
      }, [accounts,location,company]);

    const columns = [
        { title: "Title", field: "title"},
        { title: "Company", field: "namecompany"},
        { title: "Location", field: "location" },
        { title: "Date", field: 'expdate'},
        { title: "Salary", field: 'salary'},
    ]
    useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        setName(decodeUser.username)
    }, [])
    const URL = 'http://localhost:5000/admin/jobpost'
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(URL)
            result.json().then(json => {
                setAccount(json)
            })
        }
        fetchData();
    }, []);

    // Ham logout ve trang homelogin
    function handleLogOutUser() {
        localStorage.removeItem('user-save');
        window.location.href = '/login'
    }

    const handleUpdate = (rowData) =>{
        alert(`Update ${rowData._id}`)
    }
    // dung de luu lai xem tai khoan nao da login
    const token = localStorage.getItem('user-save');
    const decodeEmail = jwt_decode(token);
    const emailUser = decodeEmail.email;
    return (
        <div className="App">
            <div className={cx('wrapper')}>
                <h1 align="center">Trang quản lý JobPosts</h1>
                <div className={cx('user_log')}>
                    <h2 className={cx('name_set')}>{name}</h2>
                </div>
            </div>
            <div className={cx('table-wrapper')}>
                <MaterialTable className={cx('Table')}
                    data={filteredAccounts}
                    title = 'Company Data'
                    columns={columns}
                    actions={[
                        {
                            icon: 'edit',
                            Tooltip: 'Cập nhật',
                            onClick: (event, rowData) => handleUpdate(rowData)
                        },
                        {
                            icon: () => <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              style={{ width: 100 }}
                              value={company}
                              onChange={(e) => setCompany(e.target.value)}
                            >
                              <MenuItem value={'all'}><em>Company</em></MenuItem>
                              <MenuItem value={'aitech'}>aitech</MenuItem>
                              <MenuItem value={'FPT'}>FPT</MenuItem>
                              <MenuItem value={'TMA'}>TMA</MenuItem>
                              <MenuItem value={'Viettel'}>Viettel</MenuItem>
                              <MenuItem value={'Fujinet'}>Fujinet</MenuItem>
                            </Select>,
                            tooltip: "Filter Role",
                            isFreeAction: true
                          },
                          {
                            icon: () => <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              style={{ width: 100 }}
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                            >
                              <MenuItem value={'all'}><em>Location</em></MenuItem>
                              <MenuItem value={'HCM'}>HCM</MenuItem>
                              <MenuItem value={'Đà Nẵng'}>Đà Nẵng</MenuItem>
                              <MenuItem value={'Hà Nội'}>Hà Nội</MenuItem>
                              <MenuItem value={'Hải Phòng'}>Hải Phòng</MenuItem>
                            </Select>,
                            tooltip: "Filter Location",
                            isFreeAction: true
                          }
                    ]}
                    options={{
                        actionsColumnIndex: -1, addRowPosition: "first"
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

export default AllJobPost;