import classNames from "classnames/bind";
import styles from './skillAdmin.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import { FaUser } from "react-icons/fa";
import MaterialTable from "material-table";
import { Grid, MenuItem, Select, TablePagination, Typography, Divider } from "@material-ui/core";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import PrintIcon from '@material-ui/icons/Print'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
const cx = classNames.bind(styles)

function SkillAdmin() {


  const [name, setName] = useState('')
  const [accounts, setAccount] = useState([])
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);


  const columns = [
    {
      title: "Skill", field: "nameskill", validate: rowData => {
        if (rowData.nameskill === undefined || rowData.nameskill === "") {
          return "Required"
        } else if (rowData.nameskill.length < 3) {
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
  const URL = 'http://localhost:5000/admin/skill'
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
    XLSX.writeFile(workBook, "SkillData.xlsx")
  }
  const downloadPdf = () => {
    const doc = new jsPDF()
    doc.text("Account Details", 20, 10)
    doc.autoTable({
      theme: "grid",
      columns: columns.map(col => ({ ...col, dataKey: col.field })),
      body: accounts
    })
    doc.save('SkillData.pdf')
  }

  function handleDeleteSelected(ids) {
    //http://localhost:5000/admin/posts/account/642559a2443d4e532fde640b,642643ad9a87b5af871a61ac
    fetch(`http://localhost:5000/admin/posts/account/${ids.join(',')}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => {
        if (response.ok) {
          setTimeout(() => {
          toast.success("Xóa Skill thành công!")
          window.location.reload()
        }, 1000);
        } else {
          toast.error("Xóa Skill không thành công!")
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
        <h1 align="center">Trang quản lý Skill</h1>
        <div className={cx('user_log')}>
        <h2 className={cx('name_set')}> <FaUser/> {name}</h2>
        </div>
      </div>

      <div className={cx('table-wrapper')}>
        <MaterialTable className={cx('Table')}
          data={accounts}
          title='Skill Data'
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
              icon: () => <button />
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
              fetch('http://localhost:5000/admin/skill/create', {
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

              fetch(`http://localhost:5000/admin/skill/${id}`, {
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
            onRowUpdate: (newData, oldData) => new Promise((resolve, reject) => {
              const id = oldData._id;
              console.log(oldData._id);
              const token_update = localStorage.getItem('user-save');
              fetch(`http://localhost:5000/admin/skill/details/${id}`, {
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
          onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
          options={{
            actionsColumnIndex: -1,
            headerStyle: {
              fontSize: '18px',
              width: '200px',
            },
            columnsButton: true,
            addRowPosition: "first",
            filtering: true,
            lookupFilter: true,
            pageSize: 10, // set default page size
            pageSizeOptions: [5, 10, 20], 
            grouping:true,
            selection: true,
            rowStyle: rowData => ({
              backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
            }),
            exportButton: true
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

export default SkillAdmin;