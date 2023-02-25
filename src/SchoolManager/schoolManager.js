import classNames from "classnames/bind";
import styles from './schoolManager.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import axios, { Axios } from 'axios';


const cx = classNames.bind(styles)



function SchoolManager() {
    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])

    const columns = [
        { title: "student ID", field: "code" , },
        { title: "Name", field: "studentname" , },
        { title: "Student Email", field: "studentemail" , },
        { title: "Student Phone", field: "studentphone" , },
        { title: "Academic Year", field: "academicyear" , },
        { title: "Address", field: "address" , },
        { title: "Gender", field: "gender" , },
        { title: "Major", field: "major" , },
        { title: "School", field: "school" , },
        { title: "Verify", field: "verify" , },
      ]

      useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        console.log(decodeUser.username);
        console.log(decodeUser.email);
        setName(decodeUser.username)
    }, [])
    const school_token = localStorage.getItem('user-save');
    const URL = 'http://localhost:5000/uni'
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(URL,{
                method:'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${school_token}`
                },
            })
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
        data={accounts}
        columns={columns}
        editable={{
          
          isDeleteHidden:(row)=>row.role ==='Student' || row.role === 'School' || row.role ==='Company' ,
          isDeleteHidden:(row)=>row.role == 'Admin' && row.email === emailUser,

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

export default SchoolManager;