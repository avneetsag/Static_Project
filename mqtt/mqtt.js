var randomCoordinates = require('random-coordinates');
const rand = require('random-int');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://avneetsag:saggu1234@cluster0.oc2nc.mongodb.net', { useNewUrlParser: true, useUnifiedTopology: true });
const mqtt = require('mqtt');
const Fridge = require('./models/fridge');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static(`${__dirname}/public/generated-docs`));
app.get('/docs', (req, res) => {
 res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

app.use(express.static('public'));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});
const port = process.env.PORT || 5001;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

client.on('connect', () => {
    console.log('mqtt connected');
    const topic = '/myid/test/hello/';
    const msg = 'Hello MQTT world!';
    client.subscribe('/sensorData');
    client.publish(topic, msg, () => {
        console.log('message sent...');
    });
});

client.on('message', (topic, message) => {
    if (topic == '/sensorData') {
        const data = JSON.parse(message);

        Fridge.findOne({ "name": data.fridgeId }, (err, fridge) => {
            if (err) {
                console.log(err)
            }

            const { sensorData } = fridge;
            const { ts, loc, temp } = data;
            sensorData.push({ ts, loc, temp });
            fridge.sensorData = sensorData;
            fridge.save(err => {
                if (err) {
                    console.log(err)
                }
            });
        });
    }
});


/**
* @api {post}/send-command AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {String} Success-Response:
* {
*  published new message
* }
* @apiErrorExample {string} Error-Response:
* {
* null
* }
*/
app.post('/send-command', (req, res) => {
    const { fridgeId, command } = req.body;
    const topic = `/myid/command/${fridgeId}`;
    client.publish(topic, command, () => {
        res.send('published new message');
    });
});
/**
* @api {put}/sensor-data
* @apiGroup Device
* @apiSuccessExample {json} Input:
*[
* {
*  "deviceId": "apples"
* }
*]
* @apiSuccessExample {json} Success:
* published new message
* @apiErrorExample {string} Error-Response:
* {
* null
* }
*/
app.put('/sensor-data', (req, res) => {
    const { fridgeId } = req.body;
    const [lat, lon] = randomCoordinates().split(", ");
    const ts = new Date().getTime();
    const loc = { lat, lon };
    const temp = rand(20, 50);
    const topic = `/sensorData`;
    const message = JSON.stringify({ fridgeId, ts, loc, temp });
    console.log(message);
    client.publish(topic, message, () => {
        res.send('published new message');
    });
});

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});


