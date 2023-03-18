import classNames from "classnames/bind";
import styles from './HomeAdmin.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import Is_valid_password from "./CheckPassword";
import { Checkbox, MenuItem, Select } from "@material-ui/core";
const cx = classNames.bind(styles)

// http://localhost:5000/admin/account
function HomeAdmin() {
  const [name, setName] = useState('')
  const [accounts, setAccount] = useState([])
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [role, setRole] = useState('all')

  const columns = [
    {
      title: "name", field: "username",defaultFieldValue: 'Name', validate: rowData => {
        if (rowData.username === undefined || rowData.username === "") {
          return "Required"
        } else if (rowData.username.length < 3) {
          return "Name should contains atleast 3 chars"
        }
        return true

      }, 
    },
    {
      title: "Email", field: "email",defaultFieldValue: 'Email@gmail.com', validate: rowData => {
        if (rowData.email === undefined || rowData.email === "") {
          return "Required"
        } else if (!rowData.email.includes('@' && '.')) {
          return "Enter valid email address"
        }
        return true
      }
    },
    {
      title: "Password", field: "password", validate: rowData => {
        if (rowData.password === undefined || rowData.password === "") {
          return "Required"
        } else if (!Is_valid_password(rowData.password)) {
          return "Wrong"
        }
        return true
      }
    },

    {
      title: "Role",
      field: "role",
      lookup: {Admin:"Admin", Company: "Company", School: "School", Student: "Student" },
    },
    
  ]

 
  useEffect(() => {
    if (role === 'all') {
      setFilteredAccounts(accounts);
    } else {
      setFilteredAccounts(accounts.filter(dt => dt.role === role));
    }
  }, [role, accounts]);

  
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
        setFilteredAccounts(json);
      })
    }
    fetchData();
  }, []);

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
        <MaterialTable className={cx('table')}
          title="Account Data"
          data={filteredAccounts}
          columns={columns}
          editable={{
            onRowAdd: (newRow) => new Promise((resolve, reject) => {
              const token_create = localStorage.getItem('user-save');
              const roleValue = newRow.role ? newRow.role.value : "Admin";
              const data = {...newRow, role: roleValue};
              console.log(data);
              fetch('http://localhost:5000/admin/account/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token_create}`
                },
                body: JSON.stringify(data)
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
                console.error('Error:', error); 
                reject()
              });
            }),
          }}
          options={{
            actionsColumnIndex: -1,
            addRowPosition: "first",
            filtering: true,
            lookupFilter:true
          
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