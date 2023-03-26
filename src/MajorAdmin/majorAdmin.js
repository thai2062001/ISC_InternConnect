import classNames from "classnames/bind";
import styles from './majorAdmin.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import { Grid, MenuItem, Select, TablePagination, Typography, Divider } from "@material-ui/core";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import PrintIcon from '@material-ui/icons/Print'
import jsPDF from 'jspdf'
import 'jspdf-autotable'


const cx = classNames.bind(styles)


function MajorAdmin() {


  const [name, setName] = useState('')
  const [accounts, setAccount] = useState([])
  const columns = [
    {
      title: "Major", field: "namemajor", validate: rowData => {
        if (rowData.namemajor === undefined || rowData.namemajor === "") {
          return "Required"
        } else if (rowData.namemajor.length < 3) {
          return "Name should contains atleast 3 chars "
        }
        return true
      }
    },
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


  const downloadExcel = () => {
    const newData = accounts.map(row => {
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
      body: accounts
    })
    doc.save('Major.pdf')
  }
  return (
    <div className="App">
      <div className={cx('wrapper')}>
        <h1 align="center">Trang quản lý Major</h1>
        <div className={cx('user_log')}>
          <h2 className={cx('name_set')}>{name}</h2>
        </div>
      </div>

      <div className={cx('table-wrapper')}>
        <MaterialTable className={cx('Table')}
          data={accounts}
          title='Major Data'
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
          actions={[
            {
              icon: () => <button />,

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
                  }
                })
                .then(data => {
                  const updatedRows = [...accounts, { ...newRow }]
                  console.log(updatedRows);
                  setTimeout(() => {
                    setAccount(updatedRows)
                    window.location.reload();
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
                      window.location.reload();
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
              console.log(id);
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
                      window.location.reload();
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
            actionsColumnIndex: -1,
            headerStyle: {
              fontSize: '18px',
              width: '200px',
            },
            columnsButton:true,
            addRowPosition: "first",
            filtering: true,
            lookupFilter: true,
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