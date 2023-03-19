import classNames from "classnames/bind";
import styles from './HomeAdmin.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import Is_valid_password from "./CheckPassword";
import {  MenuItem, Select } from "@material-ui/core";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const cx = classNames.bind(styles)

// http://localhost:5000/admin/account
function HomeAdmin() {
  const [name, setName] = useState('')
  const [accounts, setAccount] = useState([])
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [role, setRole] = useState('all')


  const notify = () => toast("Wow so easy!");

  const columns = [
    {
      title: "name", field: "username", defaultFieldValue: 'Name', validate: rowData => {
        if (rowData.username === undefined || rowData.username === "") {
          return "Required"
        } else if (rowData.username.length < 3) {
          return "Name should contains atleast 3 chars"
        }
        return true

      },
    },
    {
      title: "Email", field: "email", defaultFieldValue: 'Email@gmail.com', validate: rowData => {
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
      title: "Phone", field: "phonenumber", validate: rowData => {
        if (rowData.phonenumber === undefined || rowData.phonenumber.length < 10) {
          return "Required"
        }
        return true
      }
    },

    {
      title: "Role",
      field: "role",
      lookup: { Admin: "Admin", Company: "Company", School: "School", Student: "Student" },
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

  const handleRowUpdate = (newData, oldData) => {
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
          setAccount(updatedRows);
          window.location.reload();
          toast.success('Account updated successfully!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
          });
        } else {
          throw new Error(response.statusText);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
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
        <MaterialTable className={cx('table')}
          title="Account Data"
          data={filteredAccounts}
          columns={columns}
          actions={[
            {
              icon: () => <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ width: 100 }}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value={'all'}><em>Role</em></MenuItem>
                <MenuItem value={'Admin'}>Admin</MenuItem>
                <MenuItem value={'Company'}>Company</MenuItem>
                <MenuItem value={'School'}>School</MenuItem>
                <MenuItem value={'Student'}>Student</MenuItem>
              </Select>,
              tooltip: "Filter Role",
              isFreeAction: true
            }
          ]}

          editable={{
            isDeleteHidden: (row) => row.role === 'Student' || row.role === 'School' || row.role === 'Company',
            isDeleteHidden: (row) => row.role === 'Admin' && row.email === emailUser,

            onRowAdd: (newRow) => new Promise((resolve, reject) => {
              const token_create = localStorage.getItem('user-save');
              const roleValue = newRow.role;
              const data = { ...newRow, role: roleValue };
              console.log(data); // check if role value is being passed correctly
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
          onRowUpdate :((newData, oldData) => handleRowUpdate(newData, oldData))
          }}
          options={{
            actionsColumnIndex: -1,
            addRowPosition: "first",
            filtering: true,
            lookupFilter: true

          }}
        />
        <ToastContainer/>
      </div>

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
    </div>
  );
}






export default HomeAdmin;