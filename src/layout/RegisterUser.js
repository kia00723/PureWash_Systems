import React, { useState } from 'react';
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
import Swal from 'sweetalert2'
import './Auth.css';

const Register = (props) => {
    const mainContent = React.useRef(null);


    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const [firstName, setFirstName] = useState();
    const [surName, setSurName] = useState();
    const [birthdate, setBirthdate] = useState();
    const [telephoneNumber, setTelephoneNumber] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await registerUser({
            username,
            password,
            firstName,
            surName,
            birthdate,
            telephoneNumber,
            userType : "user"
        });
        
        if ('message' in response) {
            Swal.fire("Success", 'Register Success', "success", {
                buttons: false,
                timer: 2000,
            }).then((value) => {
                // localStorage.setItem('accessToken', response['access_token']);
                // localStorage.setItem('user', JSON.stringify(response['username']));
                window.location.replace('./auth');
            });
        } else {
            Swal.fire("Failed", 'Please check your Username or Password again.', "error");
        }
    }

    return (
        <>
            <div className="Auth-form-container">
                <form className="Auth-form">
                    <div className="Auth-form-content">
                        <h3 className="Auth-form-title">Register</h3>
                        <div className="form-group mt-3">
                            <label>Username</label>
                            <input
                                type="text"
                                className="form-control mt-1"
                                placeholder="Enter Username"
                                autoComplete="new-password"
                                onChange={e => setUserName(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control mt-1"
                                placeholder="Enter Password"
                                autoComplete="new-password"
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Firstname</label>
                            <input
                                type="text"
                                className="form-control mt-1"
                                placeholder="Enter Firstname"
                                autoComplete="new-password"
                                onChange={e => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Surname</label>
                            <input
                                type="text"
                                className="form-control mt-1"
                                placeholder="Enter Surname"
                                autoComplete="new-password"
                                onChange={e => setSurName(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>Birthdate</label>
                            <input
                                type="date"
                                className="form-control mt-1"
                                placeholder="Enter Birthdate"
                                autoComplete="new-password"
                                onChange={e => setBirthdate(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-3">
                            <label>PhoneNumber</label>
                            <input
                                type="number"
                                className="form-control mt-1"
                                placeholder="Enter PhoneNumber"
                                autoComplete="new-password"
                                onChange={e => setTelephoneNumber(e.target.value)}
                            />
                        </div>

                        <div className="d-grid gap-2 mt-3">
                            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                                Register
                            </button>
                        </div>
                        <p className="forgot-password text-right mt-2">
                             <a href="/auth">cancel</a>
                        </p>
                    </div>
                </form>
            </div>
            {/* <AuthFooter /> */}
        </>
    );
};
async function registerUser(credentials) {

    return fetch('http://localhost:4025/system/registerUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}
export default Register;
