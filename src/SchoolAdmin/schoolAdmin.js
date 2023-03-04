import classNames from "classnames/bind";
import styles from './SchoolAdmin.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import axios, { Axios } from 'axios';
import Select from '@material-ui/core/Select';


const cx = classNames.bind(styles)

function SchoolAdmin() {
    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])
    const [provinces, setProvinces] = useState([]);
    const [provinceList, setProvinceList] = useState({});
    const [showDropdown, setShowDropdown] = useState(false);

    const columns = [
        {
            title: "Name School", field: "nameschool", validate: rowData => {
                if (rowData.nameschool === undefined || rowData.nameschool === "") {
                    return "Required"
                } else if (rowData.nameschool.length < 3) {
                    return "NameSchool should contains atleast 3 chars"
                }
                return true
            }
        },
        {
            title: "Location", field: "location", lookup: showDropdown ? provinceList : null,
        },
        { title: "Email School", field: "emailschool" },
        { title: "Phone Number", field: 'phoneschool' },
        { title: 'websiteschool', field: 'websiteschool' },
    ]

        
    useEffect(() => {
        fetch('https://vapi.vnappmob.com/api/province')
            .then(response => response.json())
            .then(data => {
                setProvinces(data.results);
                setProvinceList(
                    data.results.reduce((list, province) => {
                        list[province.province_id] = province.province_name;
                        return list;
                    }, {})
                );
            })
            .catch(error => console.error(error));
    }, []);
    useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        console.log(decodeUser.username);
        console.log(decodeUser.email);
        setName(decodeUser.username)
    }, [])
    const URL = 'http://localhost:5000/admin/school'
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(URL)
            result.json().then(json => {
                setAccount(json)
            })
        }
        fetchData();
    }, []);

    const token = localStorage.getItem('user-save');
    const decodeEmail = jwt_decode(token);
    const emailUser = decodeEmail.email;
    function handleLogOutUser() {
        localStorage.removeItem('user-save');
        window.location.href = '/login'
    }

    return (
        <div className="App">
            <div className={cx('wrapper')}>
                <h1 align="center">Trang quản lý School</h1>
                <div className={cx('user_log')}>
                    <h2 className={cx('name_set')}>{name}</h2>
                </div>
            </div>
            <div className={cx('table-wrapper')}>
                <MaterialTable className={cx('Table_wrapper')}
                    title="School Data"
                    data={accounts}
                    columns={columns}
                    editable={{
                        isDeleteHidden: (row) => row.role === 'Student' || row.role === 'School' || row.role === 'Company',
                        isDeleteHidden: (row) => row.role == 'Admin' && row.email === emailUser,
                        onRowAdd: (newRow) => new Promise((resolve, reject) => {
                            const token_create = localStorage.getItem('user-save');
                            setShowDropdown(true)
                            fetch('http://localhost:5000/admin/school/create', {
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
                                    } 
                                })
                                .then(data => {
                                    const updatedRows = [...accounts, { id: data.id, ...newRow }]
                                    setTimeout(() => {
                                        setAccount(updatedRows)
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

                            fetch(`http://localhost:5000/admin/school/${id}`, {
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
                            fetch(`http://localhost:5000/admin/school/details/${id}`, {
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
                                    } else {
                                        throw new Error(response.statusText);
                                    }
                                })
                                .catch(error => {
                                    console.error(error);
                                    reject(error);
                                });
                        }),
                        onBulkUpdate: selectedRow => new Promise((resolve, reject) => {
                            const rows = Object.values(selectedRow)
                            const updatedRows = [...accounts]
                            let index
                            rows.map(account => {
                                index = account.oldData.tableData.id
                                updatedRows[index] = account.newData
                            })
                            setTimeout(() => {
                                setAccount(updatedRows)
                                resolve()
                            }, 2000)

                        })



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

export default SchoolAdmin;