import React, { useEffect, useState } from 'react';

import { Container, Row, Col, Button, Modal } from 'react-bootstrap'; // เพิ่มบรรทัดนี้เพื่อนำเข้า Component ของ Bootstrap
import { useLocation, useParams,useNavigate } from 'react-router-dom';
import Header from './Headers'
import img1 from './../assets/1.jpg'
import img2 from './../assets/2.jpg'
import img3 from './../assets/3.jpg'
import cash from './../assets/cash.png'
import visa from './../assets/visa.png'
import qr from './../assets/qr-scan.png'
import dollar from './../assets/dollar.png'
import './../layout/Auth.css';
import Swal from 'sweetalert2'
function MyVerticallyCenteredModal(props) {
  // let coins = 0
  const navigate = useNavigate();
  let setDatalocal = localStorage.getItem("datas")
  let datas = JSON.parse(setDatalocal)
  let coinss = 0
  const [coins, setCoins] = useState(0);
  const countcoin = () => {
    setCoins((prevCounter) => prevCounter + 10);
    coinss = coins
    console.log(coinss)
    if (coins === 30) {
      console.log("ยอดครบแล้ว")
    }
  };
  const handleSubmit = async () => {
    const Dates = new Date()
    Dates.setDate(Dates.getDate() + 1);
    Dates.setMinutes(Dates.getMinutes() + 60);
    const currentDate = new Date(Dates).toISOString().slice(0, 10);
    const time = new Date(Dates).toTimeString().slice(0, 8);
    // const time = Date.toTimeString().slice(0, 8);
   
    const response = await bookMachine({
      user_register_id: parseInt(localStorage.getItem("user_id")) ,
      washing_machine_id: datas.id,
      status: "dead",
      date: currentDate,
      time: time,
      paytype: "c",
      createBy: localStorage.getItem("user"),
      modifyBy: localStorage.getItem("user"),
    });
    if ('message' in response) {
      Swal.fire("Success", 'Booking Success', "success", {
        buttons: false,
        timer: 2000,
      }).then((value) => {
        localStorage.removeItem('datas');
        // window.location.replace('./homemain');
        navigate(`/homemain`);
      });
    } else {
      Swal.fire("Failed", 'Please check your Username or Password again.', "error");
    }
  }
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          กรุณาใส่เงินตามจำนวน
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <div class="card mb-3"  >
          <div class="row g-0">
            <div class="col-md-4">
              <img src={dollar} alt="Logo" class="card-img-top" style={{ width: '8rem', margin: 'auto', marginTop: "10px", marginBottom: "10px", display: "block" }} />
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <div class="row" style={{ marginTop: '10px' }}>
                  <div class="col-md-6">
                    <p class="card-text">จำนวนเหรียญที่ต้องหยอด 30 บาท </p>
                  </div>
                  <div class="col-md-6">
                    <p class="card-text">จำนวนเหรียญที่หยอดแล้ว {coins} บาท </p>
                  </div>
                </div>
                <div class="row" style={{ marginTop: '10px' }}>
                  <div class="col-md-12 row">
                    <div class="col-md-6" >
                      {coins === 30 && <Button variant="primary" style={{ width: "100%" }} className="mt-3" disabled >หยอดเหรียญ</Button>}
                      {coins < 30 && <Button variant="primary" className="mt-3" style={{ width: "100%" }} onClick={() => countcoin()}>หยอดเหรียญ</Button>}
                    </div>
                    {/* onClick={props.onHide} */}
                    <div class="col-md-6" >
                      {coins < 30 && <Button variant="success" className="mt-3" style={{ width: "100%" }} disabled >จองรายการซักผ้า</Button>}
                      {coins === 30 && <Button variant="success" className="mt-3" style={{ width: "100%" }} onClick={() => handleSubmit()} >จองรายการซักผ้า</Button>}
                    </div>

                  </div>
                </div>


                {/* <Button variant="primary" className="mt-3" onClick={() => countcoin()}>หยอดเหรียญ</Button> */}
              </div>
            </div>
          </div>
        </div>

        {/* </div> */}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

const LaundryItem = (data) => {
  let [items, setItems] = useState([]);
  const location = useLocation();
  const { id } = useParams();
  const [modalShow, setModalShow] = React.useState(false);
  let setDatalocal = localStorage.getItem("datas")
  let datas = JSON.parse(setDatalocal)
  let accesstoken = localStorage.getItem("accessToken")
  const getClassNames = (datas) => {
    let statusname = ''
    switch (datas) {
      case "open":
        statusname = "ว่าง"
        break;
      case "in-progress":
        statusname = "เครื่องไม่พอใช้งาน"
        break;
      case "dead":
        statusname = "ไม่ว่าง"
        break;
    }

    // console.log(statusname)
    return statusname
  }
 
  return (
    <Container>
      <div className="App" style={{ height: "100%" }}>
        <Container style={{ height: "100%" }}>
          <Header />
          <h1 className="text-center mt-3 mb-4">PureWash Systems</h1>
          <div class="card">
            <div class="card-header">
              {datas.machine_name}
            </div>
            <div class="card-body">
              <blockquote >
                <Row>
                  <Col lg="12">
                    <div class="row g-0">
                      <div class="col-md-4">
                        <img src={datas.machine_img} alt="Logo" />
                      </div>
                      <div class="col-md-8">
                        <div class="card-body">
                          <h5 class="card-title">ชื่อรุ่น : {datas.machine_name}</h5>
                          <div class="row" >
                            <div class='col-md-12' style={{ float: 'left' }}>
                              <p class="card-text">ขนาดถังซัก(กิโลกรัม):{datas.drumsize}</p>
                            </div>
                            <div class='col-md-12' style={{ float: 'left' }}>
                              <p class="card-text">ขนาดถังอบ(กิโลกรัม):{datas.bakingsize}</p>
                            </div>
                            <div class='col-md-12' style={{ float: 'left' }}>
                              <p class="card-text">รอบปั่นหมาด(รอบ/นาที):{datas.spincycle}</p>
                            </div>
                            <div class="row" >
                              <div class='col-md-1 offset-md-5' style={{ width: "75px" }}>
                                <p class="card-text" >สถานะ</p>
                              </div>
                              {datas.status === 'in-progress' && <div class='col-md-3'>
                                <li className={`status ${datas.status}`} style={{ "list-style-type": "none", padding: "0" }}>{getClassNames(datas.status)}</li>
                              </div>}
                              {datas.status != 'in-progress' && <div class='col-md-2'>
                                <li className={`status ${datas.status}`} style={{ "list-style-type": "none", padding: "0" }}>{getClassNames(datas.status)}</li>
                              </div>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </Col>

                </Row>

              </blockquote>
            </div>
          </div>

          <div class="card" style={{ marginTop: "10px" }}>
            <div class="card-header">
              เลือกวิธีชําระเงิน
            </div>
            <div class="card-body">
              <blockquote >
                <Row>
                  <Col lg="4">
                    <div class="card" >
                      <img src={cash} alt="Logo" class="card-img-top" style={{ width: '10rem', margin: 'auto', marginTop: "10px" }} />
                      <div class="card-body" style={{ background: '#e6e6e', marginTop: "10px" }}>
                        <div>
                          {datas.status === 'in-progress' && <Button variant="success" size="lg" disabled>เงินสด</Button>}
                          {datas.status === 'dead' && <Button variant="success" size="lg" disabled>เงินสด</Button>}
                          {datas.status === 'open' && <Button variant="success" size="lg" onClick={() => setModalShow(true)}>เงินสด</Button>}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg="4"> <div class="card" >
                    <img src={visa} alt="Logo" class="card-img-top" style={{ width: '10rem', margin: 'auto', marginTop: "10px" }} />
                    <div class="card-body" style={{ background: '#e6e6e', marginTop: "10px" }}>
                      <div>
                        <Button variant="secondary" size="lg" disabled>บัตรเครดิต</Button>
                      </div>
                    </div>
                  </div></Col>
                  <Col lg="4"> <div class="card" >
                    <img src={qr} alt="Logo" class="card-img-top" style={{ width: '10rem', margin: 'auto', marginTop: "10px" }} />
                    <div class="card-body" style={{ background: '#e6e6e', marginTop: "10px" }}>
                      <div>
                        <Button variant="secondary" size="lg" disabled>พร้อมเพย์</Button>
                      </div>
                    </div>
                  </div></Col>
                </Row>
                <footer class="blockquote-footer"> <cite title="Source Title"></cite></footer>
              </blockquote>
            </div>
          </div>

        </Container>
      </div >


      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </Container>


  );

};
async function getWashingMachine(id) {
  let body = {
    id: id
  }
  return await fetch('http://localhost:4025/system/getWashingMachineByid', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(data => data.json())
}
async function getTransactionMachine(id) {
  let body = {
    id: id
  }
  return await fetch('http://localhost:4025/system/getTransactionMachineByid', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(data => data.json())
}
async function bookMachine(credentials) {
  let token = localStorage.getItem("accessToken")
  return fetch('http://localhost:4025/system/addTransactionMachine', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',   'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(credentials)
  })
    .then(data => data.json())
}
const findLatestValuesById = (arr) => {
  const latestValuesById = {};

  arr.forEach((item) => {
    let dataset = new Date(item.latest_value)
    item.latest_value = new Date(dataset).toISOString().slice(0, 10);
    const currentDateTime = new Date(`${item.latest_value}T${item.latest_time}`).getTime();
    const latestItem = latestValuesById[item.washing_machine_id];

    if (!latestItem || currentDateTime > new Date(`${latestItem.latest_value}T${latestItem.latest_time}`).getTime()) {
      // latestValuesById[item.washing_machine_id] = { ...item };\
      latestValuesById[item.washing_machine_id] = item;
    }
  });

  return Object.values(latestValuesById);
};


export default LaundryItem;