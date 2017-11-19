// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
app.use(express.static('public'));

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.MONGOLAB_URI;

var result = {};
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// http://expressjs.com/en/starter/basic-routing.html
app.get(/^\/new\/((https?:\/\/)?[a-z0-9~_\-\.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?(:\d+)*$)/, function (req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      result = {id: 'Unable to connect to the mongoDB server. Error:'};
      res.end(JSON.stringify(result));
    } else {
      console.log('Connection established to', url);
      var col = db.collection("urls");
      col.count( (err, count) => {
        if (err) {
          result = {id: 'Unable to count documets'};
          res.end(JSON.stringify(result));
        } else {
          console.log(count)
          count++;
          var shortUrl = {
            url: req.params[0],
            short: count
          };
          col.insert(shortUrl, {safe: true}, (err, doc) => {
            if (err) {
              result = {id: 'Unable to insert documet'};
              res.end(JSON.stringify(err));           
            } else  {
              delete shortUrl._id;
              shortUrl.short = req.headers.host + "/" + shortUrl.short
              res.writeHead(200, { 'Content-Type': 'application/json' });            
              res.end(JSON.stringify(shortUrl));
              db.close();
            }          
          })         
        }
      });
      
    }
  });
});
app.get(/new/, function (req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  result = {error: "wrong url"};
  res.end(JSON.stringify(result));
});
app.get(/^\/(\d+$)/, function (req, res) {
  var id = req.params[0]
  console.log(id)
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      result = {id: 'Unable to connect to the mongoDB server. Error:'};
      res.end(JSON.stringify(result));
    } else {
      console.log('Connection established to', url);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      result = {id: id, status: 'Connection established'};
      res.end(JSON.stringify(result));
      db.close();
    }
  });
});

app.get(/.*/, function (req, res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  result = "Page not found";
  res.end(result);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
