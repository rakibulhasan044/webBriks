const http = require('http');

const data = JSON.stringify({
  columnId: "some-fake-id",
  position: 1500
});

const req = http.request({
  hostname: '127.0.0.1',
  port: 6001,
  path: '/api/v1/tasks/some-fake-task-id',
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
