import classNames from "classnames/bind";
import styles from './majorAdmin.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import axios, { Axios } from 'axios';


const cx = classNames.bind(styles)


function MajorAdmin() {


    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])
    const columns = [
        { title: "Major", field: "namemajor" },
      ]
      
      useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        console.log(decodeUser.username);
        console.log(decodeUser.email);
        setName(decodeUser.username)
    }, [])
    const URL = 'http://localhost:5000/admin/major'
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(URL)
            result.json().then(json => {
                setAccount(json)
            })
        }
        fetchData();
    }, []);
    
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
        <h1 align="center">Trang quản lý Major</h1>
        <div className={cx('user_log')}>
          <h2 className={cx('name_set')}>{name}</h2>
        </div>
        </div>

        <div className={cx('table-wrapper')}>
        <MaterialTable className = {cx('Table')} 
        data={accounts}
        title = 'Major Data'
        columns={columns}
        actions ={[
          {
            icon:()=> <button/>
          }
        ]}
        editable={{
         onRowAdd: (newRow) => new Promise((resolve, reject) => {
            const token_create = localStorage.getItem('user-save');
            fetch('http://localhost:5000/admin/major/create', {
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

            fetch(`http://localhost:5000/admin/major/${id}`, {
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
                },2000)
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
            fetch(`http://localhost:5000/admin/major/details/${id}`, {
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
        </div>
       
      <link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
      </div>
     );
}

export default MajorAdmin;