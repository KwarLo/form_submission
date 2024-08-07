const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 4500;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://localhost:27017/M4C-Vol');

const db = mongoose.connection;
db.once('open', ()=>{
  console.log('mongodb connection successful');
});

const userSchema = new mongoose.Schema({
  surname: String,
  firstName: String,
  contact: String,
  voterID: String,
  pollingStationName: String,
  pollingStationCode: String,
  occupation: String,
  region: String
});

const users = mongoose.model('guarantor', userSchema);

app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/post', async(rep, res)=>{
  const {surname, firstName, contact, voterID, pollingStationName, pollingStationCode, occupation, region} = rep.body;
  const user = new users({
    surname,
    firstName,
    contact,
    voterID,
    pollingStationName,
    pollingStationCode,
    occupation,
    region
  });

  await user.save();
  console.log(user);

  res.send(`${user.firstName}, thank you for your submission`);
});

app.listen(port, ()=>{
  console.log('server started');
});