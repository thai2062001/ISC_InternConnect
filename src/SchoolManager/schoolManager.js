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
  const [address, setAdress] = useState('all')
  const [gender, setGender] = useState('all')
  const [verify, setVerify] = useState('all')
  const [major, setMajor] = useState('all')
  const [selectedRow, setSelectedRow] = useState(null);


  const [defaultFilters, setDefaultFilters] = useState({
    address: 'all',
    gender: 'all',
    verify: 'all',
    major: 'all',

  });

  useEffect(() => {
    const filteredAccounts = accounts.filter(account => {
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
  }, [accounts, address, gender, verify, major]);

  const resetFilters = () => {
    setAdress(defaultFilters.address);
    setGender(defaultFilters.gender);
    setVerify(defaultFilters.verify);
    setMajor(defaultFilters.major);

  };
  const validateStudentName = (rowData) => {
    if (!rowData.studentname) {
      return "Tên sinh viên không được để trống";
    }
    return true;
  };
  
  const validateEmail = (rowData) => {
    if (!rowData.studentemail) {
      return "Email không được để trống";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rowData.studentemail)) {
      return "Email không hợp lệ";
    }
    return true;
  };
  
  const validatePhone = (rowData) => {
    if (!rowData.studentphone) {
      return "Điện thoại không được để trống";
    }
    if (!/^\d{10}$/.test(rowData.studentphone)) {
      return "Điện thoại phải có 10 chữ số";
    }
    return true;
  };
  
  const validateAddress = (rowData) => {
    if (!rowData.address) {
      return "Địa chỉ không được để trống";
    }
    return true;
  };
  
  const validateMajor = (rowData) => {
    if (!rowData.major) {
      return "Chuyên ngành không được để trống";
    }
    return true;
  };
  
  const validateSchool = (rowData) => {
    if (!rowData.school) {
      return "Trường không được để trống";
    }
    return true;
  };
  
  const validateVerify = (rowData) => {
    if (rowData.verify === undefined) {
      return "Xác thực không được để trống";
    }
    return true;
  };
  const columns = [
    { title: "ID", field: "code", },
    { title: "Tên", field: "studentname",validate:validateStudentName },
    { title: "Email", field: "studentemail",validate:validateEmail },
    { title: "Điện thoại", field: "studentphone",validate:validatePhone },
    { title: "Địa chỉ", field: "address",validate:validateAddress },
    { title: "Giới tính", field: "gender", lookup: { Nam: "Nam", Nữ: "Nữ", Khác: "Khác" }, validateMajor },
    { title: "Chuyên ngành", field: "major",validate:validateMajor },
    { title: "Trường", field: "school", validate:validateSchool},
    { title: "Xác thực", field: "verify", lookup: { true: "Đã xác thực", false: "Chưa xác thực" }, validate:validateVerify },
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

  const token = localStorage.getItem('user-save');
  const decodeEmail = jwt_decode(token);
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
          <h1 align="center">Trang quản lý Trường</h1>
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
                  <Grid sm={6} item><Typography variant="subtitle2" style={{ fontSize: "1.5rem" }}>Thống kê</Typography></Grid>
                  <Grid sm={6} item align="center"><Typography variant="subtitle2" style={{ fontSize: "1.5rem" }}>Số dòng thỏa yêu cầu : {props.count}</Typography></Grid>
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
                  style={{ width: 110 ,fontSize:'14px'}}
                  value={address}
                  onChange={(e) => setAdress(e.target.value)}
                >
                  <MenuItem style={{fontSize:'14px'}} value={'all'}><em>Địa chỉ</em></MenuItem>
                  <MenuItem style={{fontSize:'14px'}} value={'Hồ Chí Minh'}>Hồ Chí Minh</MenuItem>
                  <MenuItem style={{fontSize:'14px'}} value={'Hà Nội'}>Hà Nội</MenuItem>
                  <MenuItem style={{fontSize:'14px'}} value={'Hải Phòng'}>Hải Phòng</MenuItem>
                  <MenuItem style={{fontSize:'14px'}} value={'Đà Nẵng'}>Đà Nẵng</MenuItem>
                  <MenuItem style={{fontSize:'14px'}} value={'Huế'}>Huế</MenuItem>
                </Select>,
                tooltip: "Filter Address",
                isFreeAction: true

              }
              , {
                icon: () => <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ width: 110 ,fontSize:'14px'}}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <MenuItem  style={{fontSize:'14px'}} value={'all'}><em>Giới tính</em></MenuItem>
                  <MenuItem  style={{fontSize:'14px'}} value={'Nam'}>Nam</MenuItem>
                  <MenuItem  style={{fontSize:'14px'}} value={'Nữ'}>Nữ</MenuItem>
                  <MenuItem  style={{fontSize:'14px'}} value={'Khác'}>Khác</MenuItem>
                </Select>,
                tooltip: "Filter Gender",
                isFreeAction: true
              }
              , {
                icon: () => <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ width: 110 ,fontSize:'14px'}}
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                >
                  <MenuItem  style={{fontSize:'14px'}} value={'all'}><em>Chuyên ngành</em></MenuItem>
                  <MenuItem  style={{fontSize:'14px'}} value={'Công nghệ thông tin'}>Công nghệ thông tin</MenuItem>
                  <MenuItem  style={{fontSize:'14px'}} value={'Kế toán'}>Kế toán</MenuItem>
                  <MenuItem  style={{fontSize:'14px'}} value={'Quản trị kinh doanh'}>Quản trị kinh doanh</MenuItem>
                  <MenuItem  style={{fontSize:'14px'}} value={'Quản trị khách sạn'}>Quản trị khách sạn</MenuItem>
                  <MenuItem  style={{fontSize:'14px'}} value={'Du lịch lữ hành'}>Du lịch lữ hành</MenuItem>
                </Select>,
                tooltip: "Filter Major",
                isFreeAction: true
              },
              {
                icon: () => <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ width: 110 ,fontSize:'14px'}}
                  value={verify}
                  onChange={(e) => setVerify(e.target.value)}
                >
                  <MenuItem  style={{fontSize:'14px'}} value={'all'}><em>Xác thực</em></MenuItem>
                  <MenuItem  style={{fontSize:'14px'}} value={true}>Đã xác thực</MenuItem>
                  <MenuItem  style={{fontSize:'14px'}} value={false}>Chưa xác thực</MenuItem>
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