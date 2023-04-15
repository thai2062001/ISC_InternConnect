import classNames from "classnames/bind";
import styles from './companyAdmin.module.scss'
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

function CompanyAdmin() {
  const [name, setName] = useState('')
  const [accounts, setAccount] = useState([])
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [location, setLocation] = useState('all')
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [listcity, setListCity] = useState([]);
  const columns = [
    {
      title: "Công ty",
      field: "namecompany",
      validate: rowData => {
        if (!rowData.namecompany) {
          return "Vui lòng nhập tên công ty."
        }
        return true;
      }
    },
    {
      title: "Email",
      field: "emailcompany",
      validate: rowData => {
        if (!rowData.emailcompany) {
          return "Vui lòng nhập email."
        } else if (!/\S+@\S+\.\S+/.test(rowData.emailcompany)) {
          return "Email không hợp lệ."
        }
        return true;
      }
    },
    {
      title: "Website",
      field: "websitecompany",
      validate: rowData => {
        if (!rowData.websitecompany) {
          return "Vui lòng nhập địa chỉ website."
        }
        return true;
      }
    },
    {
      title: "Khu vực",
      field: "location",defaultGroupOrder:1,
      validate: rowData => {
        if (!rowData.location) {
          return "Vui lòng nhập địa chỉ."
        } else if (rowData.location.length < 3) {
          return "Địa chỉ phải bắt đầu từ một chữ cái và có độ dài tối thiểu là 3."
        }
        return true;
      }
    },
    {
      title: "Địa chỉ",
      field: "place",
      validate: rowData => {
        if (!rowData.place) {
          return "Vui lòng nhập địa chỉ."
        } else if (rowData.place.length < 3) {
          return "Địa chỉ phải bắt đầu từ một chữ cái và có độ dài tối thiểu là 3."
        }
        return true;
      }
    },

    {
      title: "Điện thoại",
      field: "phonecompany",
      validate: rowData => {
        if (!rowData.phonecompany) {
          return "Vui lòng nhập số điện thoại."
        } else if (rowData.phonecompany.length < 10) {
          return "Số điện thoại hợp lệ."
        }
        return true;
      }
    },
  ];

  useEffect(() => {
    const localstore = localStorage.getItem('user-save')
    const decodeUser = jwt_decode(localstore);
    setName(decodeUser.username)
  }, [])
  const URL = 'http://localhost:5000/admin/company'
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(URL)
      result.json().then(json => {
        setAccount(json)
      })
    }
    fetchData();
  }, []);

  useEffect(() => {
    const locations = accounts.map((city) => city.location);
    const uniqueLocations = [...new Set(locations)];
    setListCity(uniqueLocations);
  }, [accounts]);

  
  // Ham logout ve trang homelogin
  function handleLogOutUser() {
    localStorage.removeItem('user-save');
    window.location.href = '/login'
  }

  useEffect(() => {
    if (location === 'all') {
      setFilteredAccounts(accounts);
    } else {
      setFilteredAccounts(accounts.filter(dt => dt.location === location));
    }
  }, [location, accounts]);


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
    XLSX.writeFile(workBook, "CompanyAdmin.xlsx")
  }
  const downloadPdf = () => {
    const doc = new jsPDF()
    doc.text("Account Details", 20, 10)
    doc.autoTable({
      theme: "grid",
      columns: columns.map(col => ({ ...col, dataKey: col.field })),
      body: filteredAccounts
    })
    doc.save('CompanyAdmin.pdf')
  }
  function handleDeleteSelected(ids) {
    //http://localhost:5000/admin/posts/account/642559a2443d4e532fde640b,642643ad9a87b5af871a61ac
    console.log(ids);
    fetch(`http://localhost:5000/admin/posts/company/${ids.join(',')}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => {
        if (response.ok) {
          setTimeout(() => {
            toast.success("Xóa công ty thành công!")
            window.location.reload()
          }, 1000);

        } else {
          toast.error("Xóa công ty không thành công!")
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }


  return (
    <div className="App">
      <div className={cx('wrapper')}>
        <h1 align="center">Trang quản lý công ty</h1>
        <div className={cx('user_log')}>
          <h2 className={cx('name_set')}>{name}</h2>
        </div>
      </div>
      <div className={cx('table-wrapper')}>
        <MaterialTable className={cx('Table')}
          data={filteredAccounts}
          title='Company Data'
          columns={columns}
          components={{
            Pagination: (props) => <>

              <Grid container style={{ padding: 15 }}>
                <Grid sm={6} item><Typography variant="subtitle2" style={{ fontSize: "1.5rem" }}>Thống kê</Typography></Grid>
                <Grid sm={6} item align="center"><Typography variant="subtitle2" style={{ fontSize: "1.5rem" }}>số dòng theo tiêu chí : {props.count}</Typography></Grid>
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
              icon: () => (
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ width: 110, fontSize: '14px' }}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <MenuItem style={{ fontSize: '14px' }} value={'all'}><em>Khu vực</em></MenuItem>
                  {listcity.map((city) => (
                    <MenuItem key={city} style={{ fontSize: '14px' }} value={city}>{city}</MenuItem>
                  ))}
                </Select>
              ),
              tooltip: "Filter Location",
              isFreeAction: true
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
            },
            {
              tooltip: 'Remove All Selected Users',
              icon: 'delete',
              onClick: () => handleDeleteSelected(selectedIds)
            }
          ]}
          editable={{
            onRowAdd: (newRow) => new Promise((resolve, reject) => {
              const token_create = localStorage.getItem('user-save');
              fetch('http://localhost:5000/admin/company/create', {
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
                  window.location.reload();
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

              fetch(`http://localhost:5000/admin/company/${id}`, {
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
              const token_update = localStorage.getItem('user-save');
              fetch(`http://localhost:5000/admin/company/details/${id}`, {
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
                    // location.reload(); reload lại web để update data

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
            sorting: true,
            columnsButton: true,
            addRowPosition: "first",
            filtering: true,
            lookupFilter: true,
            pageSize: 10, // set default page size
            pageSizeOptions: [5, 10, 20],
            grouping: true,
            selection: true,
            rowStyle: rowData => ({
              backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
            }),



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

export default CompanyAdmin;