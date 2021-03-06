const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const base = `${__dirname}/public`;
app.use(express.static('public'));
app.use((req, res, next) => {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
 next();
});
app.get('/', function (req, res) {
    res.sendFile(`${base}/fridge-list.html`);
   });
   app.get('/register-fridge', (req, res) => {
    res.sendFile(`${base}/register-fridge.html`);
   });
   app.get('/registration', (req, res) => {
    res.sendFile(`${base}/registration.html`);
   });
   app.get('/send-command', (req, res) => {
    res.sendFile(`${base}/send-command.html`);
   });
   app.get('/login', (req, res) => {
    res.sendFile(`${base}/login.html`);
   });
   app.get('/about', (req, res) => {
    res.sendFile(`${base}/about-me.html`);
   });
   app.get('/profile', (req, res) => {
    res.sendFile(`${base}/profile.html`);
   });
   app.get('*', (req, res) => {
    res.sendFile(`${base}/404.html`);
   });
   app.listen(port, () => {
    console.log(`listening on port ${port}`);
   });
