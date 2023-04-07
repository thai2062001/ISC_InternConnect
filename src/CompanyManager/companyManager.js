import classNames from "classnames/bind";
import styles from './companyManager.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import { IconButton } from '@material-ui/core';
import { FaUser, FaPlus } from "react-icons/fa";
import { Add as AddIcon, Edit as EditIcon, Mail as MailIcon } from '@material-ui/icons';
import { Grid, MenuItem, Select, TablePagination, Typography, Divider } from "@material-ui/core";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import PrintIcon from '@material-ui/icons/Print'
import jsPDF from 'jspdf'
import 'jspdf-autotable'


const cx = classNames.bind(styles)

function CompanyManager() {
  const [name, setName] = useState('')
  const [accounts, setAccount] = useState([])
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [expdate, setDate] = useState('all')
  const [location, setLocation] = useState('all')
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);



  const [defaultFilters, setDefaultFilters] = useState({
    expdate: 'all',
    location: 'all'
  });

  const resetFilters = () => {
    setDate(defaultFilters.expdate);
    setLocation(defaultFilters.location);
  };

  useEffect(() => {
    const filteredAccounts = accounts.filter(account => {
      if (location !== 'all' && account.location !== location) {
        return false;
      }
      if (expdate !== 'all' && account.expdate !== expdate) {
        return false;
      }
      return true;
    });
    setFilteredAccounts(filteredAccounts);
  }, [accounts, location, expdate]);



  const columns = [
    { title: "Tiêu đề", field: "title" },
    { title: "Ngày đăng bài", field: "DateSubmitted" },
    { title: "Ngày hết hạn", field: "expdate" },
    { title: "Thành phố", field: "place", defaultGroupOrder: 1 },
    { title: "Nghề nghiệp", field: "major" },
    { title: "Trợ cấp", field: "salary" },
    { title: "Hình thức", field: "workingform" },
    {
      title: 'Chi tiết',
      render: rowData => {
        const index = rowData.tableData.id;
        const id = accounts[index]._id;
        return (
          <IconButton onClick={() => handleDetail(id)}>
            <EditIcon />
          </IconButton>
        );
      }
    },
  ]
  useEffect(() => {
    const localstore = localStorage.getItem('user-save')
    const decodeUser = jwt_decode(localstore);
    console.log(decodeUser);
    setName(decodeUser.username)
    console.log(decodeUser.username);
  }, [])

  //call api fill data
  const company_token = localStorage.getItem('user-save');
  const URL = 'http://localhost:5000/company'
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${company_token}`
        },
      })
      result.json().then(json => {
        setAccount(json)
      })
    }
    fetchData();
  }, []);

  //Hàm click vào sẽ chuyển tới trang details của id đó
  const handleDetail = (id) => {
    window.location.href = `/companyadmin/${id}`
  }
  const handleCreate = () => {
    window.location.href = '/companyadmin/create'
  }

  //Hàm Logout và chuyển về trang login
  const token = localStorage.getItem('user-save');
  function handleLogOutUser() {
    const decodeEmail = jwt_decode(token);
    const emailUser = decodeEmail.email;
    localStorage.removeItem('user-save');
    window.location.href = '/login'
  }


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
    XLSX.writeFile(workBook, "CompanyManagerData.xlsx")
  }
  const downloadPdf = () => {
    const doc = new jsPDF()
    doc.text("Account Details", 20, 10)
    doc.autoTable({
      theme: "grid",
      columns: columns.map(col => ({ ...col, dataKey: col.field })),
      body: filteredAccounts
    })
    doc.save('CompanyManagerData.pdf')
  }

  function handleDeleteSelected(ids) {
    //http://localhost:5000/admin/posts/company/642559a2443d4e532fde640b,642643ad9a87b5af871a61ac
    fetch(`http://localhost:5000/company/posts/${ids.join(',')}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => {
        if (response.ok) {
          setTimeout(() => {
            toast.success("Xóa Jobpost thành công!")

            window.location.reload()
          }, 1000);
        } else {
          toast.error("Xóa Jobpost không thành công!")
        }
      })
      .catch(error => {
        toast.error('There was an error!', error);

      })
    // đặt thời gian chờ là 2 giây
  }
  return (
    <div className="App">
      <div className={cx('wrapper')}>
        <h1 align="center">Trang quản lý Company Jobpost</h1>

        <div className={cx('user_log')}>
          <h2 className={cx('name_set')}> <FaUser /> {name}</h2>
          <ToastContainer />
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
                style={{ width: 110, fontSize: '15px' }}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <MenuItem style={{ fontSize: '15px' }} value={'all'}><em>Location</em></MenuItem>
                <MenuItem style={{ fontSize: '15px' }} value={'HCM'}>HCM</MenuItem>
                <MenuItem style={{ fontSize: '15px' }} value={'Đà Nẵng'}>Đà Nẵng</MenuItem>
                <MenuItem style={{ fontSize: '15px' }} value={'Hà Nội'}>Hà Nội</MenuItem>
                <MenuItem style={{ fontSize: '15px' }} value={'Hải Phòng'}>Hải Phòng</MenuItem>
              </Select>,
              tooltip: "Filter Location",
              isFreeAction: true
            },
            {
              icon: () => <img style={{ width: '25px', height: '25px' }} src="https://img.icons8.com/ultraviolet/40/null/restart--v2.png" />,
              tooltip: "Reset Filters",
              onClick: () => resetFilters(),
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
              icon: 'add',
              tooltip: 'Add Jobpost',
              onClick: () => handleCreate(),
              isFreeAction: true

            },
            {
              tooltip: 'Remove All Selected Users',
              icon: 'delete',
              onClick: () => handleDeleteSelected(selectedIds)
            },
          ]}
          editable={{
            onRowDelete: selectedRow => new Promise((resolve, reject) => {
              const index = selectedRow.tableData.id;
              const id = accounts[index]._id;
              console.log(id);
              fetch(`http://localhost:5000/company/${id}`, {
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
                      window.location.reload();
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

          }}
          onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
          options={{
            editable: true,
            actionsColumnIndex: columns.length,
            localization: {
              header: {
                actions: 'Thao tác',
              },
            },
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

export default CompanyManager;