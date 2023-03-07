import classNames from "classnames/bind";
import styles from './HomeAdmin.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import Is_valid_password from "./CheckPassword";
const cx = classNames.bind(styles)

// http://localhost:5000/admin/account
function HomeAdmin() {
    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])

    const columns = [
        { title: "name", field: "username" ,validate: rowData =>{
          if(rowData.username === undefined || rowData.username === ""){
              return "Required"
          }else if(rowData.username.length < 3){
            return "Name should contains atleast 3 chars"
          }
          return true
        
        }},
        {
        title: "Email", field: "email", validate: rowData => {
          if (rowData.email === undefined || rowData.email === "") {
            return "Required"
          } else if (!rowData.email.includes('@' && '.')) {
            return "Enter valid email address"
          }
          return true
        }
      },
        { title: "Password", field: "password", validate: rowData => {
          if (rowData.password === undefined || rowData.password === "") {
            return "Required"
          } else if (!Is_valid_password(rowData.password)) {
            return "Wrong"
          }
          return true
        }
        },
        {
          title: "Phone Number", field: 'phonenumber', validate: rowData => {
            if (rowData.phonenumber === undefined || rowData.phonenumber === "") {
              return "Required"
            } else if (rowData.phonenumber.length < 10 || rowData.phonenumber.length > 10) {
              return "Wrong number phone"
            }
            return true
          }
        },

        { title: 'Role', field: 'role', values : 'Admin' }
      ]
      


      function handleRoleChange(event, rowData) {
        const newData = [...accounts];
        const rowIndex = rowData.tableData.id;
        newData[rowIndex].role = event.target.value;
        setAccount(newData);
      }
      

    useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        console.log(decodeUser.username);
        console.log(decodeUser.email);
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


     // Ham logout ve trang homelogin
    function handleLogOutUser() {
      localStorage.removeItem('user-save');
      window.location.href = '/login'
  }


  // dung de luu lai xem tai khoan nao da login

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
          
          onRowAdd: (newRow) => new Promise((resolve, reject) => {
            const token_create = localStorage.getItem('user-save');
            fetch('http://localhost:5000/admin/account/create', {
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
            fetch(`http://localhost:5000/admin/account/details/${id}`, {
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
            
       
    



export default HomeAdmin;