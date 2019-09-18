var http = require('http');
var https = require('https');
var fs = require('fs');
var mock = require('./mock/index');
var server = http.createServer(function (request, response) {
  var url = request.url;
  var mockData = mock();
  var check = true;
  if (url === '/') {
    check = false;
    response.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile('./index.html', 'utf-8', function (err, data) {
      if (err) {
        throw err;
      }
      response.end(data);
    })
  }
  if (process.env.MOCK === 'open') {
    (mockData || []).forEach(key => {
      if (url === key.url) {
        check = false;
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(key.data));
      }
    });
  }
  if (check) {
    https.get(require('./config.json').host + url, (res) => {
      var html = ""
      res.on("data", (data) => {
        html += data
      })
      res.on("end", () => {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(html);
      })
    }).on('error', (e) => {
      console.log(`Got error: ${e.message}`);
    });
  }
});
console.log('App runing at:');
console.log('- local: http://127.0.0.1:8080');
server.listen(8080);
