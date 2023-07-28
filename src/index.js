import React from 'react';
import ReactDOM from 'react-dom/client';
// import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Auth from './layout/Auth'
import {
  BrowserRouter,
  Routes,
  Route,
  Redirect,
} from "react-router-dom";
import LaundryItem from './components/LaundryItem';
import Register from './layout/RegisterUser.js'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  //   <Auth />
  // </React.StrictMode>
  <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route exact path="/homemain" element={<App />} />
        <Route path="/laundryList/:id" element={<LaundryItem />} />
        <Route path="/Register" element={<Register />} />
        {/* <Redirect from="/" to="/auth" /> */}
        <Route path="/" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  // <Switch>
  //   <Route path="/admin" render={(props) => <App {...props} />} />
  //   <Route path="/auth" render={(props) => <Auth {...props} />} />
  //   {/* <Redirect from="/" to="/auth" /> */}
  // </Switch>

);

reportWebVitals();

