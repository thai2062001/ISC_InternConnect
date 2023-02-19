import classNames from "classnames/bind";
import styles from './HomeAdmin.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from 'material-table'
import {Checkbox,Select,MenuItem} from '@material-ui/core'

import axios, { Axios } from 'axios';

const cx = classNames.bind(styles)

// http://localhost:5000/admin/account
function HomeAdmin() {
    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])
    const [filter, setFilter]=useState(true)

    const columns = [
        { title: "ID", field: "id" },
        { title: "Username", field: "username" },
        { title: "Email", field: "email" },
        { title: "Password", field: "password" },
        { title: "Phone Number", field: 'phone' },
        { title: "Role", field: 'role' },
      ]

      const handleChange=()=>{
        setFilter(!filter)
       }


    useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        console.log(decodeUser.username);
        setName(decodeUser.username)
    }, [])
    const URL = 'http://localhost:5000/admin/account'
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

    return (
        <div>
        <div className="App">
      <h1 align="center">React-App</h1>
      <h4 align='center'>Filtering in Material Table</h4>
      
      <ul >
        {accounts.map(account=>(
        <MaterialTable
        title="Employee Data"
        data={account}
        columns={columns}
        options={{
          filtering:filter
        }}
        actions={[
          {
            icon:()=><Checkbox
            checked={filter}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />,
          tooltip:"Hide/Show Filter option",
          isFreeAction:true
          },
        ]}
      />
        ))}
      
      </ul>
      
    </div>
            
        </div>
    );
}


export default HomeAdmin;