const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://avneetsag:saggu1234@cluster0.oc2nc.mongodb.net', { useNewUrlParser: true, useUnifiedTopology: true });
const User = require('./models/user');
const Fridge = require('./models/fridge');

//mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true,useUnifiedTopology: true });
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//const { exists } = require('./models/fridge');
//const fridge = require('./models/fridge');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT || 5000;
app.use(express.static('public'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

//app.use(express.static(`${__dirname}/public/generated-docs`));
// app.get('/docs', (req, res) => {
//     res.sendFile(`${__dirname}/public/generated-docs/index.html`);
// });


// var coordinates =
// {
//     x: [],
//     y: [],
//     type: "bar"
// };

// function userFunction() {
//     startTime = Date.now();


//     const user =
//     {
//         id: 0,
//         user: "man",
//         name: "jessi",
//         time: Date.now(),
//         temperature: rand(0,8)
//     }
//     const jsonString = JSON.stringify(user);
//     console.log(jsonString);

//     const newUser = new User
//         ({
//             id: user.id,
//             user: user.user,
//             name: user.name,
//             time: user.time,
//             temperature: user.temperature
//         });

//     endTime = Date.now();
//     time = endTime - startTime;
//     coordinates.x.push((new Date()).toISOString());
//     coordinates.y.push(time);

//     var graphOptions =
//     {
//         filename: "test-data",
//         fileopt: "overwrite"
//     };
//     plotly.plot(coordinates, graphOptions, function (err, msg) {
//         if (err) return console.log(err);
//         console.log(msg);
//     });

//     newUser.save().then(doc => {
//         console.log(doc);
//     }).then(() => {

//         mongoose.connection.close();
//     });

// }


app.get('/api/test', (req, res) => {
    res.send('The API is working!');
});
app.get('/api/fridges', (req, res) => {
    Fridge.find({}, (err, fridges) => {
        if (err == true) {
            return res.send(err);
        } else {
            return res.send(fridges);
        }
    });
});

app.post('/api/fridges', (req, res) => {
    const { name, user } = req.body; 
    const newFridge = new Fridge({
        name,
        user
    });
    newFridge.save(err => {
        return err
            ? res.send(err)
            : res.send('Great Name added');
    });
});


app.post('/api/authenticate', (req, res) => {
    const { user, password } = req.body;
    console.log(req.body);
    User.findOne({ name: user }, (err, found) => {
        if (err) {
            return res.send(err);
        }
        else if (!found) {
            return res.send('Sorry. We cant find any such username');
        }
        else if (found.password != password) {
            return res.send('The password is invalid');
        }
        else {
            return res.json({
                success: true,
                message: 'Authenticated successfully',
                isAdmin: found.isAdmin
            });
        }
    });
});
app.post('/api/registration', (req, res) => {
    const { user, password, isAdmin } = req.body;
    console.log(req.body);
    User.findOne({ name: user }, (err, found) => {
        if (err) {
            return res.send(err);
        }
        else if (found) {
            return res.send('User already exists');
        }
        else {
            const newUser = new User({
                name: user,
                password,
                isAdmin
            });
            newUser.save(err => {
                return err
                    ? res.send(err)
                    : res.json({
                        success: true,
                        message: 'Created new user'
                    });
            });
        }
    });
});

app.get('/api/fridges/:fridgeId/fridge-history', (req, res) => {
    const { fridgeId } = req.params;
    Fridge.findOne({ "_id": fridgeId }, (err, fridges) => {
        const { sensorData } = fridges;
        return err
            ? res.send(err)
            : res.send(sensorData);
    });
});

app.get('/api/users/:user/fridges', (req, res) => {
    const { user } = req.params;
    Fridge.find({ "user": user }, (err, fridges) => {
        return err
            ? res.send(err)
            : res.send(fridges);
    });
});

// app.get('/api/fridges', (req, res) => {
//     Fridge.find({}, (err, fridges) => {
//         return err
//             ? res.send(err)
//             : res.send(fridges);
//     });
// });

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
