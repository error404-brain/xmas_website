// index.js
var express = require('express');
var app = express();
var cors = require('cors');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.listen(3000, function() {
  console.log('Node server running @ http://localhost:3000');
});
