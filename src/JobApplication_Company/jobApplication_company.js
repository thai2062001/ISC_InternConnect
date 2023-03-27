import classNames from "classnames/bind";
import styles from './jobApplication_company.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import { Mail as MailIcon } from '@material-ui/icons';
import { FaDownload, FaTimes } from 'react-icons/fa';
import SendingMail from "./SendingMail/SendingMail";
import Popup from "reactjs-popup";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Grid, MenuItem, Select, TablePagination, Typography, Divider } from "@material-ui/core";
import * as XLSX from 'xlsx';
import PrintIcon from '@material-ui/icons/Print'
import jsPDF from 'jspdf'
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

  const [emailSending, setEmailSending] = useState('')
  const [idSending, setIdSending] = useState('')

  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [school, setSchool] = useState('all')
  const [major, setMajor] = useState('all')
  const [date, setDate] = useState('all')
  const [statusFitter, setStatusFitter] = useState('all')
  const [defaultFilters, setDefaultFilters] = useState({
    school: 'all',
    major: 'all',
    date: 'all',
    statusFitter: 'all',
  });

  const resetFilters = () => {
    setSchool(defaultFilters.school);
    setMajor(defaultFilters.major);
    setDate(defaultFilters.date);
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
      if (date !== 'all' && account.date !== date) {
        return false;
      }
      if (statusFitter !== 'all' && account.status !== statusFitter) {
        return false;
      }

      return true;
    });
    setFilteredAccounts(filteredAccounts);
  }, [accounts, school, date, major, statusFitter]);


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

  const date_string = filteredAccounts.expdate;
  const dateFormat = moment(date_string);
  const formatted_date = dateFormat.format('DD/MM/YYYY');
  
  const columns = [
    { title: "ID", field: "_id" },
    { title: "Title", field: "title" },
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "School", field: "nameschool" },
    { title: "Major", field: "major" },
    { title: "Date", field: "date" },
    { title: "Company", field: "namecompany" },
    { title: "Status", field: "status", cellStyle: { width: "250px" } },
    {
      title: 'CV',
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
      <div className={cx('wrapper')}>
        <h1 align="center">Trang quản lý Company JobApplication</h1>
        <div className={cx('user_log')}>
          <ToastContainer />
          <h2 className={cx('name_set')}>{name}</h2>
          <button onClick={handleCreate} className={cx('button-action')}>JobPost</button>
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
                <Grid sm={6} item><Typography variant="subtitle2" style={{ fontSize: "1.5rem" }}>Total</Typography></Grid>
                <Grid sm={6} item align="center"><Typography variant="subtitle2" style={{ fontSize: "1.5rem" }}>Number of rows : {props.count}</Typography></Grid>
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
              icon: () => <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ width: 100 }}
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              >
                <MenuItem value={'all'}><em>School</em></MenuItem>
                <MenuItem value={'UEF'}>UEF</MenuItem>
                <MenuItem value={'Hutech'}>Hutech</MenuItem>
                <MenuItem value={'FPT'}>FPT</MenuItem>
                <MenuItem value={'Văn Lăng'}>Văn Lăng</MenuItem>

              </Select>,
              tooltip: "Filter Verify",
              isFreeAction: true
            },

            {
              icon: () => <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ width: 100 }}
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              >
                <MenuItem value={'all'}><em>Major</em></MenuItem>
                <MenuItem value={'Công nghệ thông tin'}>Công nghệ thông tin</MenuItem>
                <MenuItem value={'Quản trị kinh doanh'}>Quản trị kinh doanh</MenuItem>
                <MenuItem value={'Kế toán'}>Kế toán</MenuItem>
                <MenuItem value={'cntt'}>cntt</MenuItem>
                <MenuItem value={'Du lịch lữ hành'}>Du lịch lữ hành</MenuItem>


              </Select>,
              tooltip: "Filter Verify",
              isFreeAction: true
            },
            {
              icon: () => <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ width: 100 }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              >
                <MenuItem value={'all'}><em>Year</em></MenuItem>
                <MenuItem value={'2021'}>2021</MenuItem>
                <MenuItem value={'2022'}>2022</MenuItem>
                <MenuItem value={'2023'}>2023</MenuItem>

              </Select>,
              tooltip: "Filter Verify",
              isFreeAction: true
            },
            {
              icon: () => <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ width: 100 }}
                value={statusFitter}
                onChange={(e) => setStatusFitter(e.target.value)}
              >
                <MenuItem value={'all'}><em>Status</em></MenuItem>
                <MenuItem value={'Đang chờ xác nhận'}>Đang chờ xác nhận</MenuItem>
                <MenuItem value={'Đã từ chối'}>Đã từ chối</MenuItem>
                <MenuItem value={'Đã xác nhận qua Email'}>Đã xác nhận qua Email</MenuItem>

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