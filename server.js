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
app.get(/^\/new\/((https?:\/\/)?[a-z0-9~_\-\.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?(:\d+)*$)/, function (req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  result = {new_id: req.params[0]};
  res.end(JSON.stringify(result));
});
app.get(/new/, function (req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  result = {error: "wrong url"};
  res.end(JSON.stringify(result));
});
app.get("/:id", function (req, res) {

  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      result = {id: 'Unable to connect to the mongoDB server. Error:'};
      res.end(JSON.stringify(result));
    } else {
      console.log('Connection established to', url);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      result = {id: req.params.id, status: 'Connection established', url: url};
      res.end(JSON.stringify(result));
      db.close();
    }
  });

});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
