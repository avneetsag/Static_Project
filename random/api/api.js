const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://avneetsag:saggu1234@cluster0.oc2nc.mongodb.net', { useNewUrlParser: true, useUnifiedTopology: true });
const Fridge = require('./models/fridge');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT || 5000;

app.post('/api/fridges', (req, res) => {
    //    const data = req.body;
      //  console.log(data)
        
      console.log(req.body.temperature)
        const name = req.body.name;
        const user = req.body.user;
        const time = req.body.time;
        const temperature = req.body.temperature;
    
        console.log(time)
        console.log(temperature)
    
        Fridge.findOne({ "name": name }, (err, fridge) => {
        if (err) {
            console.log(err)
        }
        const { sensorData } = fridge;
        console.log(sensorData)

                sensorData.push({ time, temperature });
    
                console.log(sensorData)
                fridge.sensorData = sensorData;
                console.log(fridge.sensorData)
    
       
        fridge.save(err => {
            return err
                ? res.send(err)
                : res.send(sensorData);
        });
    });
    })

/////s

///this is my modifid api 

////
// app.post('/api/fridges', (req, res) => {
//     const data = req.body
    
//     const time = req.body.time
//     const temperature = req.body.temperature

//     console.log(time)
//     console.log(temperature)
    
//     const newFridge = new Fridge({
//         time,
//         temperature
//     });
//     const { sensorData } = newFridge;
//     console.log(sensorData)

           

//             sensorData.push({ time, temperature });

//             console.log(sensorData)
//             newFridge.sensorData = sensorData;
//             console.log(newFridge.sensorData)

   
//     newFridge.save(err => {
//         return err
//             ? res.send(err)
//             : res.send(sensorData);
//     });
// });
// app.post('/api/fridges', (req, res) => {
//     const data = req.body;
//     console.log(req.body);
//     const { sensorData } = data;
//     sensorData.push({ time,temperature });
//     data.sensorData = sensorData;
//     console.log(newFridge);
//     newFridge.save(err => {
//         return err
//             ? res.send("Sorry")
//             : res.send('Great it got added');
// });
//     const string = JSON.stringify(newFridge);
//     console.log(string);
// })
// app.post('/api/fridges', (req, res) => {
//     const data = req.body;
//     console.log(req.body);
//     const newFridge = new Fridge({
//         time,
//         temperature
//     });
    
//     console.log(newFridge);
//     newFridge.save(err => {
//         return err
//             ? res.send(err)
//             : res.send('Great it got added');
// });
//     const string = JSON.stringify(newFridge);
//     console.log(string);
// });

app.listen(port, () => {
    console.log(`listening on port ${port}`);
   });
