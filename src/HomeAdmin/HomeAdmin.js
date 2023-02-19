import classNames from "classnames/bind";
import styles from './HomeAdmin.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";

import axios, { Axios } from 'axios';

const cx = classNames.bind(styles)

// http://localhost:5000/admin/account
function HomeAdmin() {
    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])
    const [filter, setFilter]=useState(true)

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


    function handleLogOutUser() {
        localStorage.removeItem('user-save');
        window.location.href = '/login'
    }

    return (
      <div className="App">
        <h1 align="center">React-App</h1>
        <h4 align='center'>Material Table with CRUD operation</h4>
        <MaterialTable
        title="Employee Data"
        data={accounts}
        columns={columns}
        editable={{
          onRowAdd: (newRow) => new Promise((resolve, reject) => {
            const updatedRows = [...accounts, { id: Math.floor(Math.random() * 100), ...newRow }]
            setTimeout(() => {
              setAccount(updatedRows)
              resolve()
            }, 2000)
          }),
          onRowDelete: selectedRow => new Promise((resolve, reject) => {
            const index = selectedRow.tableData.id;
            const updatedRows = [...accounts]
            updatedRows.splice(index, 1)
            setTimeout(() => {
              setAccount(updatedRows)
              resolve()
            }, 2000)
          }),
          onRowUpdate:(updatedRow,oldRow)=>new Promise((resolve,reject)=>{
            const index=oldRow.tableData.id;
            const updatedRows=[...accounts]
            updatedRows[index]=updatedRow
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
    );
}
            
       
    



export default HomeAdmin;