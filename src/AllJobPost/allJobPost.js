import classNames from "classnames/bind";
import styles from './allJobPost.module.scss'
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


function AllJobPost() {
  const [name, setName] = useState('')
  const [accounts, setAccount] = useState([])

  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [company, setCompany] = useState('all')
  const [location, setLocation] = useState('all')
  const [defaultFilters, setDefaultFilters] = useState({
    company: 'all',
    location: 'all'
  });

  useEffect(() => {
    const filteredAccounts = accounts.filter(account => {
      if (company !== 'all' && account.namecompany !== company) {
        return false;
      }
      if (location !== 'all' && account.location !== location) {
        return false;
      }
      return true;
    });
    setFilteredAccounts(filteredAccounts);
  }, [accounts, location, company]);

  const columns = [
    { title: "Title", field: "title" },
    { title: "Company", field: "namecompany" },
    { title: "Location", field: "location" },
    { title: "Date", field: 'expdate' },
    { title: "Salary", field: 'salary' },
  ]
  useEffect(() => {
    const localstore = localStorage.getItem('user-save')
    const decodeUser = jwt_decode(localstore);
    setName(decodeUser.username)
  }, [])
  const URL = 'http://localhost:5000/admin/jobpost'
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

  const handleUpdate = (rowData) => {
    alert(`Update ${rowData._id}`)
  }
  // dung de luu lai xem tai khoan nao da login
  const token = localStorage.getItem('user-save');
  const decodeEmail = jwt_decode(token);
  const emailUser = decodeEmail.email;

  
  const resetFilters = () => {
    setCompany(defaultFilters.company);
    setLocation(defaultFilters.location);
  };

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
    XLSX.writeFile(workBook, "AllJobPost.xlsx")
  }
  const downloadPdf = () => {
    const doc = new jsPDF()
    doc.text("Account Details", 20, 10)
    doc.autoTable({
      theme: "grid",
      columns: columns.map(col => ({ ...col, dataKey: col.field })),
      body: filteredAccounts
    })
    doc.save('AllJobPost.pdf')
  }
  return (
    <div className="App">
      <div className={cx('wrapper')}>
        <h1 align="center">Trang quản lý JobPosts</h1>
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
                <Grid sm={6} item><Typography variant="subtitle2" style={{ fontSize: "1.5rem" }}>Total</Typography></Grid>
                <Grid sm={6} item align="center"><Typography variant="subtitle2" style={{ fontSize: "1.5rem" }}>Number of rows : {props.count}</Typography></Grid>
              </Grid>
              <Divider />
              <TablePagination {...props} />
            </>
          }}
          actions={[
            {
              icon: 'edit',
              Tooltip: 'Cập nhật',
              onClick: (event, rowData) => handleUpdate(rowData)
            },
            {
              icon: () => <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ width: 100 }}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              >
                <MenuItem value={'all'}><em>Company</em></MenuItem>
                <MenuItem value={'aitech'}>aitech</MenuItem>
                <MenuItem value={'FPT'}>FPT</MenuItem>
                <MenuItem value={'TMA'}>TMA</MenuItem>
                <MenuItem value={'Viettel'}>Viettel</MenuItem>
                <MenuItem value={'Fujinet'}>Fujinet</MenuItem>
              </Select>,
              tooltip: "Filter Role",
              isFreeAction: true
            },
            {
              icon: () => <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ width: 100 }}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <MenuItem value={'all'}><em>Location</em></MenuItem>
                <MenuItem value={'HCM'}>HCM</MenuItem>
                <MenuItem value={'Đà Nẵng'}>Đà Nẵng</MenuItem>
                <MenuItem value={'Hà Nội'}>Hà Nội</MenuItem>
                <MenuItem value={'Hải Phòng'}>Hải Phòng</MenuItem>
              </Select>,
              tooltip: "Filter Location",
              isFreeAction: true
            },
            {
              icon: () => <img style={{width:'25px',height:'25px'}} src="https://img.icons8.com/ultraviolet/40/null/restart--v2.png"/>,
              tooltip: "Reset Filters",
              onClick:()=>resetFilters(),
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
      
          ]}
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

export default AllJobPost;