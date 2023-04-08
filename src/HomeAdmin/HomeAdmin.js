import classNames from "classnames/bind";
import styles from './HomeAdmin.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import { FaUser } from "react-icons/fa";
import MaterialTable from "material-table";
import Is_valid_password from "./CheckPassword";
import { Grid, MenuItem, Select, TablePagination, Typography, Divider } from "@material-ui/core";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import PrintIcon from '@material-ui/icons/Print'
import jsPDF from 'jspdf'
import 'jspdf-autotable'


const cx = classNames.bind(styles)

// http://localhost:5000/admin/account
function HomeAdmin() {
  const [name, setName] = useState('')
  const [accounts, setAccount] = useState([])
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [role, setRole] = useState('all')
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);


  const columns = [
    {
      title: "Tài khoản", field: "username",
    },
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
    {
      title: "Mật khẩu", field: "password"
    },
    {
      title: "Số điện thoại", field: "phonenumber"
    },

    {
      title: "Quyền",
      field: "role",
      lookup: { Admin: "Admin", Company: "Company", School: "School", Student: "Student" },
      defaultGroupOrder:0
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
          setFilteredAccounts(updatedRows)
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

  // dung de luu lai xem tai khoan nao da login

  const token = localStorage.getItem('user-save');
  const decodeEmail = jwt_decode(token);
  const emailUser = decodeEmail.email;

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
    XLSX.writeFile(workBook, "AccountsData.xlsx")
  }
  const downloadPdf = () => {
    const doc = new jsPDF()
    doc.text("Account Details", 20, 10)
    doc.autoTable({
      theme: "grid",
      columns: columns.map(col => ({ ...col, dataKey: col.field })),
      body: filteredAccounts
    })
    doc.save('table.pdf')
  }

  function handleDeleteSelected(ids) {
    //http://localhost:5000/admin/posts/account/642559a2443d4e532fde640b,642643ad9a87b5af871a61ac
    fetch(`http://localhost:5000/admin/posts/account/${ids.join(',')}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => {
        if (response.ok) {
          setTimeout(() => {
          toast.success("Xóa tài khoản thành công!")
          window.location.reload()
        }, 1000);
        } else {
          toast.error("Xóa tài khoản không thành công!")
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
        <h1 align="center">Trang quản lý Admin</h1>
        <div className={cx('user_log')}>
          <h2 className={cx('name_set')}> <FaUser/> {name}</h2>
        </div>
     
      <div className={cx('table-wrapper')}>
        <MaterialTable className={cx('table')}
          title="Account Data"
          data={filteredAccounts}
          columns={columns}
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
          onSelectionChange={(rows) => {
            // Update selectedIds state when user selects or deselects a row
            setSelectedIds(rows.map((row) => row._id));
          }}
          actions={[
            {
              icon: () => <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ width: 110 ,fontSize:'15px'}}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem  style={{fontSize:'15px'}}  value={'all'}><em>Role</em></MenuItem>
                <MenuItem  style={{fontSize:'15px'}} value={'Admin'}>Admin</MenuItem>
                <MenuItem  style={{fontSize:'15px'}} value={'Company'}>Company</MenuItem>
                <MenuItem  style={{fontSize:'15px'}} value={'School'}>School</MenuItem>
                <MenuItem  style={{fontSize:'15px'}} value={'Student'}>Student</MenuItem>
              </Select>,
              tooltip: "Filter Role",
              isFreeAction: true
            },
            {
              icon: () => <img style={{width:'25px',height:'25px'}} src="https://img.icons8.com/color/48/null/ms-excel.png"/>,// you can pass icon too
              tooltip: "Export to Excel",
              onClick: () => downloadExcel(),
              isFreeAction: true
            },
            {
              icon: () =><img style={{width:'25px',height:'25px'}} src="https://img.icons8.com/color/48/null/pdf-2--v1.png"/>,// you can pass icon too
              tooltip: "Export to Pdf",
              onClick: () => downloadPdf(),
              isFreeAction: true
            },
            {
              tooltip: 'Remove All Selected Users',
              icon: 'delete',
              onClick: ()=> handleDeleteSelected(selectedIds)
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
            onRowUpdate: ((newData, oldData) => handleRowUpdate(newData, oldData))
          }}
          onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
          options={{
            actionsColumnIndex: -1,
            headerStyle: {
              fontSize: '18px',
              width: '200px',
            },
            columnsButton:true,
            addRowPosition: "first",
            filtering: true,
            sorting: true,
            lookupFilter: true,
            pageSize: 10, // set default page size
            pageSizeOptions: [5, 10, 20], 
            grouping:true,
            selection: true,
            selectionProps: rowData => ({
              disabled: rowData.role === 'Admin',
              color: 'primary'
            }),
            rowStyle: rowData => ({
              backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
            }),
            exportButton: true
          }}
        />
        <ToastContainer />
      </div>
      </div>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />
    </div>
  );
}






export default HomeAdmin;