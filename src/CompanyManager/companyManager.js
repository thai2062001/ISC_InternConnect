import classNames from "classnames/bind";
import styles from './companyManager.module.scss'
import jwt_decode from "jwt-decode";
import { useState, useEffect } from 'react';
import MaterialTable from "material-table";
import axios, { Axios } from 'axios';
import { Card, Button, Row, Col } from 'react-bootstrap';
import PageDetail from "../PageDetail/pageDetail";


const cx = classNames.bind(styles)

function CompanyManager() {
    const [name, setName] = useState('')
    const [accounts, setAccount] = useState([])

    const columns = [
        { title: "benifit", field: "benifit" },
        { title: "expdate", field: "expdate" },
        { title: "gender", field: "gender" },
        { title: "location", field: "location" },
        { title: "namecompany", field: "namecompany" },
        { title: "title", field: "title" },
        { title: "required", field: "required" },
        { title: "salary", field: "salary" },
    ]

    useEffect(() => {
        const localstore = localStorage.getItem('user-save')
        const decodeUser = jwt_decode(localstore);
        console.log(decodeUser.username);
        console.log(decodeUser.email);
        setName(decodeUser.username)
    }, [])
    const company_token = localStorage.getItem('user-save');
    const URL = 'http://localhost:5000/company'
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
    const token = localStorage.getItem('user-save');
    const decodeEmail = jwt_decode(token);
    const emailUser = decodeEmail.email;
    function handleLogOutUser() {
        localStorage.removeItem('user-save');
        window.location.href = '/login'
    }

    const col_style = { display: 'flex', flexGrow: '1', marginTop: '80px' }
    const row_style = { marginTop: '0px' }

    return (
        <div>
            <button className={cx('button-action')}>Tạo bài đăng</button>
            <Row xs={1} md={3} className="g-4 " styles = {row_style}>
            {accounts.map((account, index) => (
                <Col key={account._id} style={col_style} >
                    <Card style={{ width: '30rem',borderRadius:'10px'}}>
                        <Card.Img className={cx('card-img-top')}  variant="top" src={account.url} />
                        <Card.Body>
                            <Card.Title className={cx('card-title')}>{account.title}</Card.Title>
                            <Card.Text>
                                {account.namecompany}
                            </Card.Text>
                            <Card.Text>
                                {account.salary}
                            </Card.Text>
                            <Button onClick={()=>(handleDetail(account._id))} className={cx('btn-primary')} variant="primary">Xem thêm</Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"></link>
        </Row>
        </div>
            
                    
    );
}

export default CompanyManager;