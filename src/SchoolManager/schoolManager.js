import classNames from "classnames/bind";
import styles from './schoolManager.module.scss'
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



function SchoolManager() {
  const [name, setName] = useState('')
  const [accounts, setAccount] = useState([])

  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [year, setYear] = useState('all')
  const [address, setAdress] = useState('all')
  const [gender, setGender] = useState('all')
  const [verify, setVerify] = useState('all')
  const [major, setMajor] = useState('all')
  const [selectedRow, setSelectedRow] = useState(null);


  const [defaultFilters, setDefaultFilters] = useState({
    year: 'all',
    address: 'all',
    gender: 'all',
    verify: 'all',
    major: 'all',

  });

  useEffect(() => {
    const filteredAccounts = accounts.filter(account => {
      if (year !== 'all' && account.academicyear !== year) {
        return false;
      }
      if (address !== 'all' && account.address !== address) {
        return false;
      }
      if (gender !== 'all' && account.gender !== gender) {
        return false;
      }
      if (verify !== 'all' && account.verify !== verify) {
        return false;
      }
      if (major !== 'all' && account.major !== major) {
        return false;
      }
      return true;
    });
    setFilteredAccounts(filteredAccounts);
  }, [accounts, year, address, gender, verify, major]);

  const resetFilters = () => {
    setYear(defaultFilters.year);
    setAdress(defaultFilters.address);
    setGender(defaultFilters.gender);
    setVerify(defaultFilters.verify);
    setMajor(defaultFilters.major);

  };
  const columns = [
    { title: "ID", field: "code", },
    { title: "Name", field: "studentname", },
    { title: "Email", field: "studentemail", },
    { title: "Phone", field: "studentphone", },
    { title: "Year", field: "academicyear", },
    { title: "Address", field: "address", },
    { title: "Gender", field: "gender", lookup: { Nam: "Nam", Nữ: "Nữ", Khác: "Khác" }, },
    { title: "Major", field: "major", },
    { title: "School", field: "school", },
    { title: "Verify", field: "verify", },
  ]

  useEffect(() => {
    const localstore = localStorage.getItem('user-save')
    const decodeUser = jwt_decode(localstore);
    setName(decodeUser.username)
  }, [])
  const school_token = localStorage.getItem('user-save');
  const URL = 'http://localhost:5000/uni';

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${school_token}`
        },
      });
      const data = await result.json();

      // Tìm tất cả các object có trường "school" bằng với biến "name"
      const targetObjects = data.filter(obj => obj.school === name);

      // Gán dữ liệu vào state "account"
      setAccount(targetObjects);
    };
    fetchData();
  }, [name]);


  // Ham logout ve trang homelogin
  function handleLogOutUser() {
    localStorage.removeItem('user-save');
    window.location.href = '/login'
  }


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
    XLSX.writeFile(workBook, "SchoolManagerData.xlsx")
  }
  const downloadPdf = () => {
    const doc = new jsPDF()
    doc.text("Account Details", 20, 10)
    doc.autoTable({
      theme: "grid",
      columns: columns.map(col => ({ ...col, dataKey: col.field })),
      body: filteredAccounts
    })
    doc.save('SchoolManagerData.pdf')
  }


    return (
      <div className="App">
        <div className={cx('wrapper')}>
          <h1 align="center">Trang quản lý Admin</h1>
          <div className={cx('user_log')}>
          <h2 className={cx('name_set')}> <FaUser/> {name}</h2>
          </div>
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
            actions={[
              {
                icon: () => <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ width: 110 ,fontSize:'15px'}}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <MenuItem style={{fontSize:'15px'}} value={'all'}><em>Year</em></MenuItem>
                  <MenuItem style={{fontSize:'15px'}} value={'2017'}>2017</MenuItem>
                  <MenuItem style={{fontSize:'15px'}} value={'2018'}>2018</MenuItem>
                  <MenuItem style={{fontSize:'15px'}} value={'2019'}>2019</MenuItem>
                  <MenuItem style={{fontSize:'15px'}} value={'2020'}>2020</MenuItem>
                  <MenuItem style={{fontSize:'15px'}} value={'2021'}>2021</MenuItem>
                </Select>,
                tooltip: "Filter Year",
                isFreeAction: true
              }
              , {
                icon: () => <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ width: 110 ,fontSize:'15px'}}
                  value={address}
                  onChange={(e) => setAdress(e.target.value)}
                >
                  <MenuItem style={{fontSize:'15px'}} value={'all'}><em>Location</em></MenuItem>
                  <MenuItem style={{fontSize:'15px'}} value={'HCM'}>HCM</MenuItem>
                  <MenuItem style={{fontSize:'15px'}} value={'Hà Nội'}>Hà Nội</MenuItem>
                  <MenuItem style={{fontSize:'15px'}} value={'Hải Phòng'}>Hải Phòng</MenuItem>
                  <MenuItem style={{fontSize:'15px'}} value={'Đà Nẵng'}>Đà Nẵng</MenuItem>
                  <MenuItem style={{fontSize:'15px'}} value={'Huế'}>Huế</MenuItem>
                </Select>,
                tooltip: "Filter Address",
                isFreeAction: true

              }
              , {
                icon: () => <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ width: 110 ,fontSize:'15px'}}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem  style={{fontSize:'15px'}} value={'all'}><em>Gender</em></MenuItem>
                  <MenuItem  style={{fontSize:'15px'}} value={'Nam'}>Nam</MenuItem>
                  <MenuItem  style={{fontSize:'15px'}} value={'Nữ'}>Nữ</MenuItem>
                  <MenuItem  style={{fontSize:'15px'}} value={'Khác'}>Khác</MenuItem>
                </Select>,
                tooltip: "Filter Gender",
                isFreeAction: true
              }
              , {
                icon: () => <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ width: 110 ,fontSize:'15px'}}
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                >
                  <MenuItem  style={{fontSize:'15px'}} value={'all'}><em>Major</em></MenuItem>
                  <MenuItem  style={{fontSize:'15px'}} value={'Công nghệ thông tin'}>Công nghệ thông tin</MenuItem>
                  <MenuItem  style={{fontSize:'15px'}} value={'Kế toán'}>Kế toán</MenuItem>
                  <MenuItem  style={{fontSize:'15px'}} value={'Quản trị kinh doanh'}>Quản trị kinh doanh</MenuItem>
                  <MenuItem  style={{fontSize:'15px'}} value={'Quản trị khách sạn'}>Quản trị khách sạn</MenuItem>
                  <MenuItem  style={{fontSize:'15px'}} value={'Du lịch lữ hành'}>Du lịch lữ hành</MenuItem>
                </Select>,
                tooltip: "Filter Major",
                isFreeAction: true
              },
              {
                icon: () => <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ width: 110 ,fontSize:'15px'}}
                  value={verify}
                  onChange={(e) => setVerify(e.target.value)}
                >
                  <MenuItem  style={{fontSize:'15px'}} value={'all'}><em>Verify</em></MenuItem>
                  <MenuItem  style={{fontSize:'15px'}} value={true}>True</MenuItem>
                  <MenuItem  style={{fontSize:'15px'}} value={false}>False</MenuItem>
                </Select>,
                tooltip: "Filter Verify",
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
            ]}
            editable={{

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
                        window.location.reload();
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
            onRowClick={((evt, selectedRow) => setSelectedRow(selectedRow.tableData.id))}
            options={{
              actionsColumnIndex: -1, addRowPosition: "first",
              headerStyle: {
                fontSize: '18px',
                width: '200px',
              },
              columnsButton: true,
              actionsColumnIndex: -1,
              addRowPosition: "first",
              filtering: true,
              lookupFilter: true,
              pageSize: 5, // set default page size
              pageSizeOptions: [5, 10, 15],
              grouping: true,
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

  export default SchoolManager;