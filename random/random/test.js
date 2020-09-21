const axios = require('axios');
const randomInt = require('random-int');
//setInterval(makePostRequest, 10000);

async function makePostRequest() {
  const name = "great";
  const time = Date.now();
  const temperature = randomInt(10,30);
  console.log(temperature);
  console.log(time);
  const body = {
    name,
    time,
    temperature
  };

    let res = await axios.post('http://localhost:5000/api/fridges/sensorData', body);    

}
makePostRequest();