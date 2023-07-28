
import React, { useState } from 'react';
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
import Swal from 'sweetalert2'
import './Auth.css';
import { useNavigate } from 'react-router-dom';
const Auth = (props) => {
  const mainContent = React.useRef(null);
  const navigate = useNavigate();
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await loginUser({
      username,
      password,
      strategy: 'local',
    });
    if ('access_token' in response) {
      Swal.fire("Success", 'Login Success', "success", {
        buttons: false,
        timer: 2000,
      }).then((value) => {
        localStorage.setItem('accessToken', response['access_token']);
        localStorage.setItem('user', response['username']);
        localStorage.setItem('user_id', response['id']);
        window.location.replace('./homemain');
      });
    } else {
      Swal.fire("Failed", 'Please check your Username or Password again.', "error");
    }
  }
  const handleRegister = () => {
    navigate(`/Register`); 
    // window.location.replace('/laundryList');
  
  };
  return (
    <>
      <div className="Auth-form-container">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Sign In</h3>
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
            <div className="d-grid gap-2 mt-3">
              <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                Submit
              </button>
              <button type="submit" className="btn btn-warning"  onClick={() => handleRegister()}>
              Register
              </button>
              
            </div>

            {/* <p className="forgot-password text-right mt-2">
              Forgot <a href="#">password?</a>
            </p> */}
           
          </div>
        </form>
      </div>
      {/* <AuthFooter /> */}
    </>
  );
};

async function loginUser(credentials) {
  // if (credentials.username === 'admin' && credentials.password === 'admin') {
  //   Swal.fire("Success", 'Login Success', "success", {
  //     buttons: false,
  //     timer: 2000,
  //   }).then((value) => {
  //     // window.location.replace('/admin/index');
  //   });

  // } else {
  //   Swal.fire("Failed", 'Please check your Username or Password again.', "error");
  // }
  return fetch('http://localhost:4025/system/loginCheck', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
   
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}
export default Auth;
