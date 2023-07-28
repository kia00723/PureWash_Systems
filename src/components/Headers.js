import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css'; // นำเข้าไฟล์ CSS ของ Bootstrap
import { useNavigate } from 'react-router-dom';


const Header = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
            localStorage.clear();
            navigate(`/auth`);
    };

    // const handleLogout = () => {
    //     setLoggedIn(false);
    // };
    let username = localStorage.getItem('user')
    // username = username.slice(0, username.length);
    return (
        <>
            <nav className="navbar navbar-expand navbar-light bg-light">
                <div className="container">
                    <h1 className="navbar-brand">PureWash Systems login By: {username}</h1>
                        <button className="btn btn-outline-danger" onClick={handleLogout}>
                            Logout
                        </button>
                </div>
            </nav>
        </>
    );
};

export default Header;
