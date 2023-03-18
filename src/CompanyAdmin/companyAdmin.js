import classNames from "classnames/bind";
import styles from './companyAdmin.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import {  MenuItem, Select } from "@material-ui/core";
const cx = classNames.bind(styles)


function CompanyAdmin() {
    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [location, setLocation] = useState('all')

    const columns = [
        { title: "Company", field: "namecompany",validate: rowData =>{
            if(rowData.namecompany === undefined || rowData.namecompany === ""){
                return "Required"
            }else if(rowData.namecompany.length < 3){
              return "namecompany should contains atleast 3 chars"
            }
            return true
          
          } },
        { title: "Email", field: "emailcompany",validate: rowData =>{
            if(rowData.namecompany === undefined || rowData.namecompany === ""){
                return "Required"
            }
            return true
          
          } },
        { title: "Website", field: "websitecompany" ,validate: rowData =>{
            if(rowData.websitecompany === undefined || rowData.websitecompany === ""){
                return "Required"
            }
            return true
          
          } },
        { title: "Phone Number", field: 'phonecompany',validate: rowData =>{
            if(rowData.phonecompany === undefined || rowData.phonecompany === ""){
                return "Required"
            }else if(rowData.namecompany.length > 10){
              return "wrong"
            }
            return true
          
          } },
    ]
    useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        setName(decodeUser.username)
    }, [])
    const URL = 'http://localhost:5000/admin/company'
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

    useEffect(() => {
        if (location === 'all') {
          setFilteredAccounts(accounts);
        } else {
          setFilteredAccounts(accounts.filter(dt => dt.location === location));
        }
      }, [location, accounts]);
    

    // dung de luu lai xem tai khoan nao da login
    const token = localStorage.getItem('user-save');
    const decodeEmail = jwt_decode(token);
    const emailUser = decodeEmail.email;
    return (
        <div className="App">
            <div className={cx('wrapper')}>
                <h1 align="center">Trang quản lý Company</h1>
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
                          icon: () => <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            style={{ width: 100 }}
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          >
                            <MenuItem value={'all'}><em>All</em></MenuItem>
                            <MenuItem value={'HCM'}>HCM</MenuItem>
                            <MenuItem value={'Đà Nẵng'}>Đà Nẵng</MenuItem>
                            <MenuItem value={'Hà Nội'}>Hà Nội</MenuItem>
                            <MenuItem value={'Hải Phòng'}>Hải Phòng</MenuItem>
                          </Select>,
                          tooltip: "Filter Location",
                          isFreeAction: true
                        }
                      ]}
                    editable={{
                        onRowAdd: (newRow) => new Promise((resolve, reject) => {
                            const token_create = localStorage.getItem('user-save');
                            fetch('http://localhost:5000/admin/company/create', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token_create}`
                                },
                                body: JSON.stringify(newRow)
                            })
                                .then(response => {
                                    if (response.ok) {
                                        return response.json();
                                    } else {
                                        throw new Error(response.statusText);
                                    }
                                })
                                .then(data => {
                                    const updatedRows = [...accounts, { id: data.id, ...newRow }]
                                    setTimeout(() => {
                                        setAccount(updatedRows)
                                        window.location.reload();
                                        resolve()
                                    }, 2000)
                                })
                                .catch(error => {
                                    console.error(error);
                                    reject(error)
                                })
                        }),
                        onRowDelete: selectedRow => new Promise((resolve, reject) => {
                            const index = selectedRow.tableData.id;
                            const id = accounts[index]._id;
                            console.log(id);

                            fetch(`http://localhost:5000/admin/company/${id}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            })
                                .then(response => {
                                    if (response.ok) {
                                        const updatedRows = [...accounts]
                                        updatedRows.splice(index, 1)
                                        setTimeout(() => {
                                            setAccount(updatedRows)
                                            resolve()
                                        }, 2000)
                                    } else {
                                        reject(response.statusText)
                                    }
                                })
                                .catch(error => {
                                    console.error(error);
                                    reject(error)
                                })
                        }),
                        onRowUpdate: (newData, oldData) => new Promise((resolve, reject) => {
                            const id = oldData._id;
                            const token_update = localStorage.getItem('user-save');
                            fetch(`http://localhost:5000/admin/company/details/${id}`, {
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
                                            resolve();
                                        }, 2000);
                                        // location.reload(); reload lại web để update data
                            
                                        window.location.reload();
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

export default CompanyAdmin;