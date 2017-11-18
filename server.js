// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var result = {};
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/new/:id", function (req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
    result = {new_id: req.params.id};
 // res.write(JSON.stringify(result));
  res.end(JSON.stringify(result));
});

app.get("/:id", function (req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  result = {id: req.params.id};
 // res.write(JSON.stringify(result));
  res.end(JSON.stringify(result));
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
