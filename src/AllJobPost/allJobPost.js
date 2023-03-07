import classNames from "classnames/bind";
import styles from './allJobPost.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import { Tooltip } from "bootstrap";

const cx = classNames.bind(styles)


function AllJobPost() {
    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])

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
                    data={accounts}
                    title = 'Company Data'
                    columns={columns}
                    actions={[
                        {
                            icon: 'edit',
                            Tooltip: 'Cập nhật',
                            onClick: (event, rowData) => handleUpdate(rowData)
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