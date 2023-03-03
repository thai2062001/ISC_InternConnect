import classNames from "classnames/bind";
import styles from './companyManager.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import axios, { Axios } from 'axios';
import PageDetail from "../PageDetail/pageDetail";
import { IconButton } from '@material-ui/core';
import { Add as AddIcon, Edit as EditIcon } from '@material-ui/icons';


const cx = classNames.bind(styles)

function CompanyManager() {
    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])

    const columns = [
        { title: "title", field: "title" },
        { title: "expdate", field: "expdate" },
        { title: "location", field: "location" },
        { title: "salary", field: "salary" },
        {
            title: 'Details',
            render: rowData => {
                const index = rowData.tableData.id;
                const id = accounts[index]._id;
                return (
                    <IconButton onClick={() => handleDetail(id)}>
                        <EditIcon />
                    </IconButton>
                );
            }
        },
    ]
    useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        setName(decodeUser.username)
    }, [])

    //call api fill data
    const company_token = localStorage.getItem('user-save');
    const URL = 'http://localhost:5000/company'
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${company_token}`
                },
            })
            result.json().then(json => {
                setAccount(json)
            })
        }
        fetchData();
    }, []);

    //Hàm click vào sẽ chuyển tới trang details của id đó
    const handleDetail = (id) => {
        window.location.href = `/companyadmin/${id}`
    }
    const handleCreate = () =>{
        window.location.href = '/companyadmin/create'
    }

    //Hàm Logout và chuyển về trang login
    const token = localStorage.getItem('user-save');
    function handleLogOutUser() {
        const decodeEmail = jwt_decode(token);
        const emailUser = decodeEmail.email;
        localStorage.removeItem('user-save');
        window.location.href = '/login'
    }
    return (
            <div className="App">
                <div className={cx('wrapper')}>
                    <h1 align="center">Trang quản lý Company Jobpost</h1>
                    <div className={cx('user_log')}>

                        <h2 className={cx('name_set')}>{name}</h2>
                        <button onClick={handleCreate} className={cx('button-action')}>JobPost</button>
                        
                    </div>
                </div>

                <div className={cx('table-wrapper')}>
                    <MaterialTable className={cx('Table')}
                        data={accounts}
                        title='Company Data'
                        columns={columns}

                        editable={{
                            onRowDelete: selectedRow => new Promise((resolve, reject) => {
                                const index = selectedRow.tableData.id;
                                const id = accounts[index]._id;
                                console.log(id);
                                fetch(`http://localhost:5000/company/${id}`, {
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

export default CompanyManager;