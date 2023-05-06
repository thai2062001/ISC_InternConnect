import classNames from "classnames/bind";
import styles from './jobApplication_company.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import { Mail as MailIcon } from '@material-ui/icons';
import { FaDownload, FaTimes,FaUser } from 'react-icons/fa';
import SendingMail from "./SendingMail/SendingMail";
import Popup from "reactjs-popup";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Grid, MenuItem, Select, TablePagination, Typography, Divider } from "@material-ui/core";
import * as XLSX from 'xlsx';
import PrintIcon from '@material-ui/icons/Print'
import jsPDF from 'jspdf'
import { Helmet } from 'react-helmet';
import 'jspdf-autotable'
import moment from 'moment';


const cx = classNames.bind(styles)


function JobApplication() {
  const [name, setName] = useState('')
  const [accounts, setAccount] = useState([])
  const [showPopup, setShowPopup] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [statusText, setStatus] = useState('')

  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const [emailSending, setEmailSending] = useState('')
  const [idSending, setIdSending] = useState('')

  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [school, setSchool] = useState('all')
  const [listschool, setListSchool] = useState([]);

  const [major, setMajor] = useState('all')
  const [listmajor, setListMajor] = useState([]);

  const [statusFitter, setStatusFitter] = useState('all')
  const [defaultFilters, setDefaultFilters] = useState({
    school: 'all',
    major: 'all',
    statusFitter: 'all',
  });

  const apiMajor = 'http://localhost:5000/admin/major'
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(apiMajor)
      result.json().then(json => {
        setListMajor(json)
      })
    }
    fetchData();
  }, []);

  useEffect(() => {
    const majors = accounts.map((major) => major.major);
    const uniqueLocations = [...new Set(majors)];
    setListMajor(uniqueLocations);
  }, [accounts]);

  useEffect(() => {
    if (major === 'all') {
      setFilteredAccounts(accounts);
    } else {
      setFilteredAccounts(accounts.filter(dt => dt.major === major));
    }
  }, [major, accounts]);



  const apiSchool = 'http://localhost:5000/admin/school'
  useEffect(() => {
      const fetchData = async () => {
          const result = await fetch(apiSchool)
          result.json().then(json => {
              setListSchool(json)
          })
      }
      fetchData();
  }, []);
  useEffect(() => {
    const schools = accounts.map((school) => school.nameschool);
    const uniqueLocations = [...new Set(schools)];
    setListSchool(uniqueLocations);
  }, [accounts]);

  useEffect(() => {
    if (school === 'all') {
      setFilteredAccounts(accounts);
    } else {
      setFilteredAccounts(accounts.filter(dt => dt.nameschool === school));
    }
  }, [school, accounts]);





  const resetFilters = () => {
    setSchool(defaultFilters.school);
    setMajor(defaultFilters.major);
    setStatusFitter(defaultFilters.statusFitter);
  };


  useEffect(() => {
    const filteredAccounts = accounts.filter(account => {
      if (school !== 'all' && account.nameschool !== school) {
        return false;
      }
      if (major !== 'all' && account.major !== major) {
        return false;
      }
      if (statusFitter !== 'all' && account.status !== statusFitter) {
        return false;
      }

      return true;
    });
    setFilteredAccounts(filteredAccounts);
  }, [accounts, school, major, statusFitter]);


  const handleRefuse = (event, rowData) => {
    const token = localStorage.getItem('user-save');
    const idRefuse = rowData._id
    fetch(`http://localhost:5000/company/list-cv/details/${idRefuse}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => {
        if (response.ok) {
          setStatus(rowData.status);
          toast.success('Đã từ chối ứng viên!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

        } else {
          throw new Error(response.statusText);
        }
      })
      .catch(error => {
        console.error(error);
        // handle error
      });
  }
  const handleMail = (event, rowData) => {
    setIdSending(rowData._id)
    setSelectedEmail(rowData.email)
    setShowPopup(true) // Khi người dùng click vào action MailIcon, cập nhật showPopup thành true

  }

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  }
  
  const columns = [
    { title: "Tiêu đề", field: "title" },
    { title: "Sinh Viên", field: "name" },
    { title: "Email", field: "email" },
    { title: "Trường", field: "nameschool", defaultGroupOrder:1 },
    { title: "Ngành nghề", field: "major" },
    { title: "Ngày nộp", field: "date" ,render: rowData => formatDate(rowData.date) },
    { title: "Công ty", field: "namecompany" },
    { title: "Trạng thái", field: "status", cellStyle: { width: "250px" } },
    {
      title: 'Hồ sơ ',
      render: rowData => (
        <a style={{ textAlign: 'left' }} target="_blank" href={rowData.url} >
          <FaDownload style={{ fontSize: '15px' }} />
        </a>
      ),
    },
  ]
  useEffect(() => {
    const localstore = localStorage.getItem('user-save')
    const decodeUser = jwt_decode(localstore);
    setName(decodeUser.username)
    setEmailSending(decodeUser.email)

  }, [])

  //call api fill data
  const company_token = localStorage.getItem('user-save');
  const URL = 'http://localhost:5000/company/list-cv'
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
        json.forEach(item => {
          setStatus(item.status)
        });
        setAccount(json)
      })
    }
    fetchData();
  }, []);
  const handleDetail = (id) => {
    window.location.href = `/companyadmin/${id}`
  }
  const handleCreate = () => {
    window.location.href = '/companyadmin/create'
  }
  const handleClose = () => {
    setShowPopup(false)
    toast.success('Đã gửi email ứng viên!', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

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
    XLSX.writeFile(workBook, "JobApplicationData.xlsx")
  }
  const downloadPdf = () => {
    const doc = new jsPDF()
    doc.text("Account Details", 20, 10)
    doc.autoTable({
      theme: "grid",
      columns: columns.map(col => ({ ...col, dataKey: col.field })),
      body: filteredAccounts
    })
    doc.save('JobApplicationData.pdf')
  }
  return (
    <div className="App">
            <Helmet>
        <title>Quản lý hồ sơ tuyển dụng</title>
      </Helmet>
      <div className={cx('wrapper')}>
        <h1 align="center">Trang quản lý hồ sơ xin việc</h1>
        <div className={cx('user_log')}>
          <ToastContainer />
          <h2 className={cx('name_set')}> <FaUser/> {name}</h2>
        </div>
      </div>
      <Popup open={showPopup} onClose={handleClose}>
        <SendingMail idSending={idSending} company_email={emailSending} email={selectedEmail} onClose={() => setShowPopup(false)} />
      </Popup>
      <div className={cx('table-wrapper')}>
        <MaterialTable className={cx('Table')}
          data={filteredAccounts}
          title='Company Data'
          columns={columns}
          components={{
            Pagination: (props) => <>

              <Grid container style={{ padding: 15 }}>
                <Grid sm={6} item><Typography variant="subtitle2" style={{ fontSize: "1.5rem" }}>Thống kê</Typography></Grid>
                <Grid sm={6} item align="center"><Typography variant="subtitle2" style={{ fontSize: "1.5rem" }}>Số cột theo tiêu chí : {props.count}</Typography></Grid>
              </Grid>
              <Divider />
              <TablePagination {...props} />
            </>
          }}
          actions={[
            {
              icon: FaTimes,
              tooltip: "Refuse",
              onClick: handleRefuse
            },
            {
              icon: MailIcon,
              tooltip: "Send email",
              onClick: handleMail
            },
            {
              icon: () => (
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ width: 110, fontSize: '14px' }}
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                >
                  <MenuItem style={{ fontSize: '14px' }} value={'all'}><em>Trường </em></MenuItem>
                  {listschool.map((school) => (
                    <MenuItem key={school} style={{ fontSize: '14px' }} value={school}>{school}</MenuItem>
                  ))}
                </Select>
              ),
              tooltip: "Filter Location",
              isFreeAction: true
            },

            {
              icon: () => (
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ width: 110, fontSize: '14px' }}
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                >
                  <MenuItem style={{ fontSize: '14px' }} value={'all'}><em>Ngành nghề</em></MenuItem>
                  {listmajor.map((major) => (
                    <MenuItem key={major} style={{ fontSize: '14px' }} value={major}>{major}</MenuItem>
                  ))}
                </Select>
              ),
              tooltip: "Filter Location",
              isFreeAction: true
            },
            {
              icon: () => <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ width: 110 ,fontSize:'15px'}}
                value={statusFitter}
                onChange={(e) => setStatusFitter(e.target.value)}
              >
                <MenuItem style={{fontSize:'15px'}} value={'all'}><em>Trạng thái</em></MenuItem>
                <MenuItem style={{fontSize:'15px'}} value={'Đang chờ xác nhận'}>Đang chờ xác nhận</MenuItem>
                <MenuItem style={{fontSize:'15px'}} value={'Đã từ chối'}>Đã từ chối</MenuItem>
                <MenuItem style={{fontSize:'15px'}} value={'Đã xác nhận qua Email'}>Đã xác nhận qua Email</MenuItem>

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
            {
              icon: 'add' ,
              tooltip: 'Add Jobpost',
              onClick: () => handleCreate(),
              isFreeAction: true
              
          },

          ]}
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

export default JobApplication;