import classNames from "classnames/bind";
import styles from './SchoolAdmin.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import { FaUser } from "react-icons/fa";
import axios, { Axios } from 'axios';
import { Grid, MenuItem, Select, TablePagination, Typography, Divider } from "@material-ui/core";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@material-ui/core';
import * as XLSX from 'xlsx';
import PrintIcon from '@material-ui/icons/Print'
import jsPDF from 'jspdf'
import 'jspdf-autotable'


const cx = classNames.bind(styles)

function SchoolAdmin() {
    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [location, setLocation] = useState('all')
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);

    const columns = [
        {
            title: "Trường", field: "nameschool", validate: rowData => {
                if (rowData.nameschool === undefined || rowData.nameschool === "") {
                    return "Required"
                } else if (rowData.nameschool.length < 3) {
                    return "NameSchool should contains atleast 3 chars"
                }
                return true
            }
        },
        {
            title: "Địa điểm", field: "location",defaultGroupOrder:1
        },
        { title: "Email", field: "emailschool" },
        { title: "Điện thoại", field: 'phoneschool' },
        { title: 'Website', field: 'websiteschool' },
    ]
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
    useEffect(() => {
        if (location === 'all') {
            setFilteredAccounts(accounts);
        } else {
            setFilteredAccounts(accounts.filter(dt => dt.location === location));
        }
    }, [location, accounts]);

    const downloadExcel = () => {
        const newData = filteredAccounts.map(row => {
            delete row.tableData
            return row
        })
        const workSheet = XLSX.utils.json_to_sheet(newData)
        const workBook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workBook, workSheet, "accounts")
        //Buffer
        let buf = XLSX.write(workBook, { bookType: "xlsx", type: "buffer" })
        //Binary string
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
        //Download
        XLSX.writeFile(workBook, "SchoolAdmin.xlsx")
    }
    const downloadPdf = () => {
        const doc = new jsPDF()
        doc.text("School Admin Details", 20, 10)
        doc.autoTable({
            theme: "grid",
            columns: columns.map(col => ({ ...col, dataKey: col.field })),
            body: filteredAccounts
        })
        doc.save('SchoolAdmin.pdf')
    }


    function handleDeleteSelected(ids) {
        //http://localhost:5000/admin/posts/school/6414325bbe0bee2e19c13f96,64142f23be0bee2e19c13f62
        fetch(`http://localhost:5000/admin/posts/school/${ids.join(',')}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => {
                if (response.ok) {
                    setTimeout(() => {
                        toast.success("Xóa School thành công!")
                        window.location.reload()
                    }, 2000);
                } else {
                    toast.error("Xóa School không thành công!")
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
        // đặt thời gian chờ là 2 giây
    }



    return (
        <div className="App">
            <div className={cx('wrapper')}>
                <h1 align="center">Trang quản lý School</h1>
                <div className={cx('user_log')}>
                <h2 className={cx('name_set')}> <FaUser/> {name}</h2>
                    <ToastContainer/>
                </div>
            </div>
            <div className={cx('table-wrapper')}>
                <MaterialTable className={cx('Table_wrapper')}
                    title="School Data"
                    data={filteredAccounts}
                    columns={columns}
                    onSelectionChange={(rows) => {
                        // Update selectedIds state when user selects or deselects a row
                        setSelectedIds(rows.map((row) => row._id));
                    }}
                    components={{
                        Pagination: (props) => <>

                            <Grid container style={{ padding: 15 }}>
                                <Grid sm={6} item><Typography variant="subtitle2" style={{ fontSize: "1.5rem" }}>Total</Typography></Grid>
                                <Grid sm={6} item align="center"><Typography variant="subtitle2" style={{ fontSize: "1.5rem" }}>Number of rows : {props.count}</Typography></Grid>
                            </Grid>
                            <Divider />
                            <TablePagination {...props} />
                        </>
                    }}
                    actions={[
                        {
                            icon: () => <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                style={{ width: 110 ,fontSize:'15px'}}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            >
                                <MenuItem style={{fontSize:'15px'}} value={'all'}><em>Location</em></MenuItem>
                                <MenuItem style={{fontSize:'15px'}} value={'HCM'}>HCM</MenuItem>
                                <MenuItem style={{fontSize:'15px'}} value={'Đà Nẵng'}>Đà Nẵng</MenuItem>
                                <MenuItem style={{fontSize:'15px'}} value={'Hà Nội'}>Hà Nội</MenuItem>
                                <MenuItem style={{fontSize:'15px'}} value={'Hải Phòng'}>Hải Phòng</MenuItem>
                            </Select>,
                            tooltip: "Filter Location",
                            isFreeAction: true
                        },
                        {
                            icon: () => <img style={{ width: '25px', height: '25px' }} src="https://img.icons8.com/color/48/null/ms-excel.png" />,// you can pass icon too
                            tooltip: "Export to Excel",
                            onClick: () => downloadExcel(),
                            isFreeAction: true
                        },
                        {
                            icon: () => <img style={{ width: '25px', height: '25px' }} src="https://img.icons8.com/color/48/null/pdf-2--v1.png" />,// you can pass icon too
                            tooltip: "Export to Pdf",
                            onClick: () => downloadPdf(),
                            isFreeAction: true
                        },
                        {
                            tooltip: 'Remove All Selected Users',
                            icon: 'delete',
                            onClick: () => handleDeleteSelected(selectedIds)
                        }
                    ]}
                    editable={{
                        isDeleteHidden: (row) => row.role === 'Student' || row.role === 'School' || row.role === 'Company',
                        isDeleteHidden: (row) => row.role == 'Admin' && row.email === emailUser,
                        onRowAdd: (newRow) => new Promise((resolve, reject) => {
                            const token_create = localStorage.getItem('user-save');
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
                                        window.location.reload();
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
                    onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
                    options={{
                        actionsColumnIndex: -1, addRowPosition: "first",
                        headerStyle: {
                            fontSize: '18px',
                            width: '200px',
                        },
                        columnsButton: true,
                        filtering: true,
                        lookupFilter: true,
                        pageSize: 5, // set default page size
                        pageSizeOptions: [5, 10, 15],
                        grouping: true,
                        selection: true,
                        rowStyle: rowData => ({
                            backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
                        }),
                        exportButton: true
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