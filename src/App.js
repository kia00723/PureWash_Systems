// src/App.js
import React, { useEffect, useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import img1 from './assets/1.jpg'
import img2 from './assets/2.jpg'
import img3 from './assets/3.jpg'
import { Container, Row, Col, Button } from 'react-bootstrap'; // เพิ่มบรรทัดนี้เพื่อนำเข้า Component ของ Bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import Header from './components/Headers'

const App = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  let accesstoken = localStorage.getItem("accessToken")
  useEffect(() => {
    if (accesstoken === null || accesstoken === undefined || accesstoken === "") {
      localStorage.clear()
      window.location.replace('./auth');
    }
   
    fetchData()
    const intervalId = setInterval(() => {
      doSomething();
    }, 60000);

    return () => clearInterval(intervalId);

  }, []);
  const handleLogout = (id, data) => {
    console.log(data)
    localStorage.setItem("datas", JSON.stringify(data))
    navigate(`/laundryList/${id}`);
    // window.location.replace('/laundryList');

  };
  const doSomething = () => {
    setCounter((prevCounter) => prevCounter + 1);
  };
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
      default:
        statusname = "ว่าง"
        break;
    }
    // console.log(statusname)
    return statusname
  }
  const compareTimes = (datas) => {
    if (datas != null) {
      const time1Parts = datas.split(':');
      const time2all = new Date()
      const hours1 = parseInt(time1Parts[0], 10);
      const minutes1 = parseInt(time1Parts[1], 10);
      const seconds1 = parseInt(time1Parts[2], 10);

      const hours2 = parseInt(time2all.getHours());
      const minutes2 = parseInt(time2all.getMinutes());
      const seconds2 = parseInt(time2all.getSeconds());

      const totalMinutes1 = hours1 * 60 + minutes1;
      const totalMinutes2 = hours2 * 60 + minutes2;
      // console.log(totalMinutes1, totalMinutes2)
      let difference = 0;
      if (totalMinutes1 > totalMinutes2) {
        difference = Math.abs(totalMinutes1 - totalMinutes2);
      } else {
        difference = 0;
      }

      return difference
    } else {
      return 0
    }


  };
  let datas
  const [counter, setCounter] = useState(0);
  const fetchData = async () => {
    const Washing = await getWashingMachine()
    if(Washing.length === undefined){
      localStorage.clear()
      window.location.replace('./auth');
    }
    const Transaction = await getTransactionMachine()
    let response = []

    for (let i = 0; i < Washing.length; i++) {
      let img
      switch (Washing[i].machine_img) {
        case 'img1':
          img = img1
          break;

        case 'img2':
          img = img2
          break;

        case 'img3':
          img = img3
          break;
      }
      let body = {
        id: Washing[i].id,
        machine_name: Washing[i].machine_name,
        machine_img: img,
        status: "open",
        time: "",
        drumsize: Washing[i].machine_drumsize,
        bakingsize: Washing[i].machine_bakingsize,
        spincycle: Washing[i].machine_spincycle,
      }
      response.push(body)
    }

    const latestData = await findLatestValuesById(Transaction);
    if (latestData.length != 0) {
      for (let re = 0; re < response.length; re++) {
        for (let ta = 0; ta < latestData.length; ta++) {
          if (response[re].id === latestData[ta].washing_machine_id) {
            response[re].status = latestData[ta].status
            response[re].time = latestData[ta].latest_time
          }
        }
      }
    }

    datas = response
    setItems(datas)
  };

  return (
    <div className="App" style={{ height: "100%" }}>
      <Container style={{ height: "100%" }}>
        <Header />
        <h1 className="text-center mt-3 mb-4">PureWash Systems</h1>
        <div class="card">
          <div class="card-header">
            รายการ
          </div>
          <div class="card-body">
            <blockquote >
              <Row>
                {/* <Col md={{ span: 6, offset: 3 }}> */}
                {items.map((data, idx) => (
                  <Col key={data.id} lg="4" md="4" style={{ marginTop: "10px" }}>
                    <div class="card mb-3" style={{ "max-width": "540px" }}>
                      <div class="row g-0">
                        <div class="col-md-4">
                          <img src={data.machine_img} alt="Logo" />
                        </div>
                        <div class="col-md-8">
                          <div class="card-body" >
                            <h6 class="card-title">{data.machine_name}{data.id}</h6>
                            <div class="row" >
                              <div class='col-md-4'>
                                <p class="card-text" >สถานะ :</p>
                              </div>
                              <div class='col-md-8'>
                                {/* {data.status === 'open' && } */}
                                <li className={`status ${data?.status}`} style={{ "list-style-type": "none", padding: "0" }}>{getClassNames(data.status)}</li>
                              </div>
                            </div>
                            <div class="row" >
                              <div class='col-md-7' style={{ float: 'left' }}>
                                <p class="card-text"><small class="text-muted">เวลาที่เครื่องทำงาน</small></p>
                              </div>
                              <div class='col-md-4'>
                                <p class="card-text"><small class="text-muted">{compareTimes(data?.time || null)} นาที</small></p>
                              </div>
                            </div>
                            {data.status === "open" && <Button variant="primary" className="mt-3" onClick={() => handleLogout(data.id, data)}>จองรายการซักผ้า</Button>}
                            {data.status != "open" && <Button variant="primary" className="mt-3" disabled>จองรายการซักผ้า</Button>}

                            {/* <Button variant="primary" className="mt-3" onClick={() => handleLogout(data.id)}>จองรายการซักผ้า</Button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
              <footer class="blockquote-footer"> <cite title="Source Title"></cite></footer>
            </blockquote>
          </div>
        </div>
      </Container>
    </div >
  );
};
async function getWashingMachine() {
  let token = localStorage.getItem("accessToken")
  return await fetch('http://localhost:4025/system/getWashingMachine', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
    .then(data => data.json())
}
async function getTransactionMachine() {
  let token = localStorage.getItem("accessToken")
  return await fetch('http://localhost:4025/system/getTransactionMachine', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',   'Authorization': `Bearer ${token}`

    }
  })
    .then(data => data.json())
}
async function handlelist() {
}

const findLatestValuesById = (arr) => {
  const latestValuesById = {};

  arr.forEach((item) => {
    item.latest_value = new Date(item.latest_value).toISOString().slice(0, 10);
    const currentDateTime = new Date(`${item.latest_value}T${item.latest_time}`).getTime();
    const latestItem = latestValuesById[item.washing_machine_id];

    if (!latestItem || currentDateTime > new Date(`${latestItem.latest_value}T${latestItem.latest_time}`).getTime()) {
      latestValuesById[item.washing_machine_id] = { ...item };
    }
  });

  return Object.values(latestValuesById);
};

export default App;

// src/App.css
