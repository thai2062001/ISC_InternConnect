import classNames from "classnames/bind";
import styles from './jobApplication_company.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import { Mail as MailIcon } from '@material-ui/icons';
import SendingMail from "./SendingMail/SendingMail";
import Popup from "reactjs-popup";

const cx = classNames.bind(styles)


function JobApplication() {
    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])
    const [showPopup, setShowPopup] = useState(false)
    const [selectedEmail, setSelectedEmail] = useState('')
    const [emailSending, setEmailSending] = useState('')
    const [idSending, setIdSending] = useState('')


    const handleMail = (event, rowData) => {
        setShowPopup(true) // Khi người dùng click vào action MailIcon, cập nhật showPopup thành true
        setSelectedEmail(rowData.email)
    }
    const columns = [
        { title: "Name", field: "name" },
        { title: "Email", field: "email" },
        { title: "School", field: "nameschool" },
        { title: "Major", field: "major" },
        { title: "CV", field: "url" },
        { title: "Date", field: "date" },
        { title: "Company", field: "namecompany" },
    ]
    useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        setName(decodeUser.username)
        setEmailSending(decodeUser.email)
        setIdSending(decodeUser.id)
        
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
                    data={accounts}
                    title='Company Data'
                    columns={columns}
                    actions={[
                        {
                            icon: MailIcon,
                            tooltip: "Send email",
                            onClick: handleMail
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