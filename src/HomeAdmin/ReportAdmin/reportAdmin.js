import classNames from "classnames/bind";
import styles from './reportAdmin.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import { FaUser } from "react-icons/fa";
import MaterialTable from "material-table";
import { Mail as MailIcon } from '@material-ui/icons';
import { Grid, TablePagination, Typography, Divider } from "@material-ui/core";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Popup from "reactjs-popup";
import { Helmet } from 'react-helmet';
import SendingMailReport from "./SendingMail/SendingMailReport";



const cx = classNames.bind(styles)

function ReportAdmin() {
    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedRowReport, setSelectedRowReport] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [popup, setPopup] = useState(false);



    useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        setName(decodeUser.username)
    }, [])
    const URL = 'http://localhost:5000/admin/report'
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(URL)
            result.json().then(json => {
                setAccount(json)
                setFilteredAccounts(json);
            })
        }
        fetchData();
    }, []);
    const columns = [
        {
            title: "Email sinh viên", field: "Email",
        },
        {
            title: "Tiêu đề", field: "Title" ,defaultGroupOrder:1,

        },
        {
            title: "Lý do báo cáo", field: "content"
        },
        {
            title: "Email công ty", field: "EmailCom"
        },
    ]


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
        XLSX.writeFile(workBook, "ReportData.xlsx")
    }
    const downloadPdf = () => {
        const doc = new jsPDF()
        doc.text("Account Details", 20, 10)
        doc.autoTable({
            theme: "grid",
            columns: columns.map(col => ({ ...col, dataKey: col.field })),
            body: filteredAccounts,
            styles: {
                font: "'Barlow', sans-serif",
                fontStyle: "bold"
              }
        })
        doc.save('ReportData.pdf')
    }


    const handleClick = (props) => {
        setSelectedRowReport(props)
    }
    const handleSendMail = () => {
        setPopup(true);
        
    }

    return (
        <div className="App">
                  <Helmet>
        <title>Quản lý phản hồi </title>
      </Helmet>
            <div className={cx('wrapper')}>
            <ToastContainer />
                <h1 align="center">Trang quản lý bài đăng phản hồi</h1>
                <div className={cx('user_log')}>
                    <h2 className={cx('name_set')}> <FaUser /> {name}</h2>
                </div>
                {(accounts && selectedRowReport) &&  (
                    <Popup open={popup} onClose={() => setPopup(false)}>
                        <SendingMailReport
                            title={selectedRowReport.Title}
                            emailCom={selectedRowReport.EmailCom}
                            onClose={() => setPopup(false)}
                        />
                    </Popup>
                )}

                <div className={cx('table-wrapper')}>
                    <MaterialTable className={cx('table')}
                        title="Account Data"
                        data={filteredAccounts}
                        columns={columns}
                        components={{
                            Pagination: (props) => <>
                                <Grid container style={{ padding: 15 }}>
                                    <Grid sm={6} item><Typography variant="subtitle2" style={{ fontSize: "1.5rem" }}>Thống kê</Typography></Grid>
                                    <Grid sm={6} item align="center"><Typography variant="subtitle2" style={{ fontSize: "1.5rem" }}>Số dòng theo tiêu chí : {props.count}</Typography></Grid>
                                </Grid>
                                <Divider />
                                <TablePagination {...props} />
                            </>
                        }}
                        onSelectionChange={(rows) => {
                            // Update selectedIds state when user selects or deselects a row
                            setSelectedIds(rows.map((row) => handleClick(row)));
                        }}
                        actions={[
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
                            }, {
                                tooltip: 'Gửi mail',
                                icon: MailIcon,
                                onClick: handleSendMail,
                            }
                        ]}

                        editable={{
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
                            sorting: true,
                            lookupFilter: true,
                            pageSize: 10, // set default page size
                            pageSizeOptions: [5, 10, 20],
                            grouping: true,
                            selection: true,
                            selectionProps: rowData => ({
                                disabled: rowData.role === 'Admin',
                                color: 'primary'
                            }),
                            rowStyle: rowData => ({
                                backgroundColor: (selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
                            }),
                            exportButton: true
                        }}
                    />
                   
                </div>
            </div>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
            />
        </div>
    );
}

export default ReportAdmin;