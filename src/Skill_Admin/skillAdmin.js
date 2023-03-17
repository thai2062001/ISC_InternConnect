import classNames from "classnames/bind";
import styles from './skillAdmin.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";

const cx = classNames.bind(styles)

function SkillAdmin() {


    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])
    const columns = [
        { title: "Skill", field: "nameskill" , validate: rowData => {
          if (rowData.nameskill === undefined || rowData.nameskill === "") {
            return "Required"
          } else if (rowData.nameskill.length <3 ) {
            return "Name should contains atleast 3 chars "
          }
          return true
        }},
      ]
      
      useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        console.log(decodeUser.username);
        console.log(decodeUser.email);
        setName(decodeUser.username)
    }, [])
    const URL = 'http://localhost:5000/admin/skill'
    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch(URL)
            result.json().then(json => {
                setAccount(json)
            })
        }
        fetchData();
    }, []);
    
    function handleLogOutUser() {
        localStorage.removeItem('user-save');
        window.location.href = '/login'
    }
    
    const token = localStorage.getItem('user-save');
    const decodeEmail = jwt_decode(token);
    const emailUser = decodeEmail.email;


    return ( 
        <div className="App">
        <div className={cx('wrapper')}>
        <h1 align="center">Trang quản lý Major</h1>
        <div className={cx('user_log')}>
          <h2 className={cx('name_set')}>{name}</h2>
        </div>
        </div>

        <div className={cx('table-wrapper')}>
        <MaterialTable className = {cx('Table')} 
        data={accounts}
        title = 'Major Data'
        columns={columns}
        actions ={[
          {
            icon:()=> <button/>
          }
        ]}
        editable={{
         onRowAdd: (newRow) => new Promise((resolve, reject) => {
            const token_create = localStorage.getItem('user-save');
            fetch('http://localhost:5000/admin/skill/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token_create}`
              },
              body: JSON.stringify(newRow)
            })
            .then(response => {
              if (response.ok) {
                return response.json();
              } 
            })
            .then(data => {
              const updatedRows = [...accounts, {  ...newRow }]
              console.log(updatedRows);
              setTimeout(() => {
                setAccount(updatedRows)
                resolve()
              }, 2000)
            })
            .catch(error => {
              console.error(error);
              reject(error)
            })
          }),
          onRowDelete: selectedRow => new Promise((resolve, reject) => {
            const index = selectedRow.tableData.id;
            const id = accounts[index]._id;
            console.log(id);

            fetch(`http://localhost:5000/admin/skill/${id}`, {
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
                  resolve()
                },2000)
              } else {
                reject(response.statusText)
              }
            })
            .catch(error => {
              console.error(error);
              reject(error)
            })
          }),
          onRowUpdate: (newData, oldData) => new Promise((resolve, reject) => {
            const id = oldData._id;
            console.log(oldData._id);
            const token_update = localStorage.getItem('user-save');
            fetch(`http://localhost:5000/admin/skill/details/${id}`, {
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
                  resolve();
                }, 2000);
                window.location.reload();
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

export default SkillAdmin;