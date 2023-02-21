import classNames from "classnames/bind";
import styles from './HomeAdmin.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import CustomRow from "../Component/customRow";
import axios, { Axios } from 'axios';
import { IconButton } from '@material-ui/core';

const cx = classNames.bind(styles)

// http://localhost:5000/admin/account
function HomeAdmin() {
    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])
   
    const columns = [
        { title: "name", field: "username" },
        { title: "Email", field: "email" },
        { title: "Password", field: "password" },
        { title: "Phone Number", field: 'phonenumber' },
        { title: "role", field: 'role' },
      ]


      

    useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        console.log(decodeUser.username);
        setName(decodeUser.username)
    }, [])
    const URL = 'http://localhost:5000/admin/account'
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(URL)
            result.json().then(json => {
                setAccount(json)
            })
        }
        fetchData();
    }, []);

    const URLDelete = 'http://localhost:5000/admin/account/63e4c81aa487f672585430ba'

    async function deleteRow(oldData) {
      try {
        // Gọi API để xóa user
        await fetch(`http://localhost:5000/admin/account/${oldData.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          }
        });
    
        // Cập nhật lại dữ liệu trên bảng
        const newData = [...accounts];
        const index = accounts.indexOf(oldData);
        newData.splice(index, 1);
        setAccount(newData);
      } catch (error) {
        console.error(error);
      }
    }

 

    function handleLogOutUser() {
        localStorage.removeItem('user-save');
        window.location.href = '/login'
    }

    return (
      <div className="App">
        <div className={cx('wrapper')}>
        <h1 align="center">Trang quản lý Admin</h1>
        <button onClick={handleLogOutUser} className={cx('btn')}>Đăng xuất</button>
        </div>
        

        <MaterialTable 
        title="Employee Data"
        data={accounts}
        columns={columns}
        actions ={[
          {
            icon:()=> <button/>
          }
        ]}
        editable={{
          isDeleteHidden:(row)=>row.role ==='Admin',
          
          onRowAdd: (newRow) => new Promise((resolve, reject) => {
            const updatedRows = [...accounts, { id: Math.floor(Math.random() * 100), ...newRow }]
            setTimeout(() => {
              setAccount(updatedRows)
              resolve()
            }, 2000)
          }),
          onRowDelete: selectedRow => new Promise((resolve, reject) => {
            const index = selectedRow.tableData.id;
            const id = accounts[index]._id;
            console.log(id);
            const token = localStorage.getItem('user-save');
            fetch(`http://localhost:5000/admin/account/${id}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
            .then(response => {
              if (response.ok) {
                const updatedRows = [...accounts]
                updatedRows.splice(index, 1)
                setAccount(updatedRows)
                resolve()
                console.warn('Thanh cong');
                console.log(accounts);
              } else {
                reject(response.statusText)
              }
            })
            .catch(error => {
              console.error(error);
              reject(error)
            })
          }),
          onRowUpdate:(updatedRow,oldRow)=>new Promise((resolve,reject)=>{
            const index=oldRow.tableData.id;
            const updatedRows=[...accounts]
            updatedRows[index]=updatedRow
            setTimeout(() => {
              setAccount(updatedRows)
              resolve()
            }, 2000)
          }),
          onBulkUpdate:selectedRow => new Promise((resolve,reject) =>{
            const rows = Object.values(selectedRow)
            const updatedRows = [...accounts]
            let index 
            rows.map(account=>{
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
          actionsColumnIndex: -1, addRowPosition: "first"
        }}
      />
      <link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
      </div>
    );
}
            
       
    



export default HomeAdmin;