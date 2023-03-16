import classNames from "classnames/bind";
import { FaUserAlt, FaLock, FaEnvelope, FaPhoneAlt, FaSchool } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


function VerifyAccount() {
    const [accounts,setAccount]= useEffect('')
    const { id } = useParams();


    // const url = new URL(window.location.href);
    // const email = url.pathname.split('/').pop();

    //     const URL = 'http://localhost:5000/auth/confirm/email'
    //     useEffect(() => {
    //         const fetchData = async () => {
    //             const result = await fetch(URL, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //             })
    //             result.json().then(json => {
    //                 setAccount(json)
    //             })
    //         }
    //         fetchData();
    //     }, []);

    return ( 
    <div>
        <h1>DAy la page</h1>
    </div> );
}

export default VerifyAccount;