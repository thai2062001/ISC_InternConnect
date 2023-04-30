import classNames from "classnames/bind";
import styles from './allJobPost.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import { FaUser } from "react-icons/fa";
import { Grid, MenuItem, Select, TablePagination, Typography, Divider } from "@material-ui/core";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const cx = classNames.bind(styles)


function AllJobPost() {
  const [name, setName] = useState('')
  const [accounts, setAccount] = useState([])
  const [selectedRow, setSelectedRow] = useState(null);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [location, setLocation] = useState('all')
  const [selectedIds, setSelectedIds] = useState([]);
  const [listcity, setListCity] = useState([]);
  
  const [defaultFilters, setDefaultFilters] = useState({
    location: 'all'
  });

  useEffect(() => {
    const filteredAccounts = accounts.filter(account => {
      if (location !== 'all' && account.location !== location) {
        return false;
      }
      return true;
    });
    setFilteredAccounts(filteredAccounts);
  }, [accounts, location]);

  const columns = [
    { title: "Title", field: "title" },
    { title: "Company", field: "namecompany" ,defaultGroupOrder:1},
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

  const handleUpdate = (rowData) => {
    alert(`Update ${rowData._id}`)
  }
  // dung de luu lai xem tai khoan nao da login
  const token = localStorage.getItem('user-save');
  const decodeEmail = jwt_decode(token);
  const emailUser = decodeEmail.email;

  
  const resetFilters = () => {
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

  function handleDeleteSelected(ids) {
    //http://localhost:5000/admin/posts/account/642559a2443d4e532fde640b,642643ad9a87b5af871a61ac
    console.log(ids);
    fetch(`http://localhost:5000/admin/posts/jobpost/${ids.join(',')}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => {
        if (response.ok) {
          setTimeout(() => {
          toast.success("Xóa bài đăng thành công!")
          window.location.reload()
        }, 1000);

        } else {
          toast.error("Xóa bài đăng không thành công!")
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
}


  return (
    <div className="App">
      <div className={cx('wrapper')}>
        <h1 align="center">Trang quản lý JobPosts</h1>
        <div className={cx('user_log')}>
        <h2 className={cx('name_set')}> <FaUser /> {name}</h2>
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
                <Grid sm={6} item align="center"><Typography variant="subtitle2" style={{ fontSize: "1.5rem" }}>Số dòng theo tiêu chí : {props.count}</Typography></Grid>
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
              icon: 'edit',
              Tooltip: 'Cập nhật',
              onClick: (event, rowData) => handleUpdate(rowData)
            },
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
            {
              tooltip: 'Remove All Selected Users',
              icon: 'delete',
              onClick: ()=> handleDeleteSelected(selectedIds)
            }
      
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

export default AllJobPost;