import classNames from "classnames/bind";
import styles from './jobApplication_company.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import { Mail as MailIcon } from '@material-ui/icons';
import {FaDownload, FaTimes} from 'react-icons/fa';
import SendingMail from "./SendingMail/SendingMail";
import Popup from "reactjs-popup";
import {  MenuItem, Select } from "@material-ui/core";


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

          return true;
        });
        setFilteredAccounts(filteredAccounts);
      }, [accounts, school, date, major]);


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
          setStatus(accounts.status)
      
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
    console.log(idSending);
    const columns = [
      { title: "ID", field: "_id" },
        { title: "Title", field: "title" },
        { title: "Name", field: "name" },
        { title: "Email", field: "email" },
        { title: "School", field: "nameschool" },
        { title: "Major", field: "major" },
        { title: "Date", field: "date" },
        { title: "Company", field: "namecompany" },

        {
            title: 'CV',
            render: rowData => (
              <a style={{textAlign:'left'}} target="_blank" href={rowData.url} >
                <FaDownload style={{fontSize:'15px'}}/>
              </a>
            ),
          },
          { title: "Status", field: "status" ,cellStyle: { width: "250px" } },
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

    const token = localStorage.getItem('user-save');
    function handleLogOutUser() {
        const decodeEmail = jwt_decode(token);
        const emailUser = decodeEmail.email;
        localStorage.removeItem('user-save');
        window.location.href = 'login'
    }

    return (
        <div className="App">
            <div className={cx('wrapper')}>
                <h1 align="center">Trang quản lý Company JobApplication</h1>
                <div className={cx('user_log')}>

                    <h2 className={cx('name_set')}>{name}</h2>
                    <button onClick={handleCreate} className={cx('button-action')}>JobPost</button>
                </div>
            </div>
            <Popup open={showPopup} onClose={() => setShowPopup(false)}>
            <SendingMail idSending={idSending} company_email={emailSending} email={selectedEmail} onClose={() => setShowPopup(false)} />
            </Popup>
            <div className={cx('table-wrapper')}>
                <MaterialTable className={cx('Table')}
                    data={filteredAccounts}
                    title='Company Data'
                    columns={columns}
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

                    ]}

                    options={{
                        actionsColumnIndex: -1, addRowPosition: "first",
                        headerStyle: {
                            fontSize: '18px',
                            width: '200px',
                        },
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