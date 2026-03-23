const http = require('http');

const data = JSON.stringify({
    amount: 11,
    address: { name: 'A', phone: '1', street: 's', city: 'c', zip: '1' }
});

const req = http.request(
    'http://localhost:5000/api/payments/create-order',
    { method: 'POST', headers: { 'Content-Type': 'application/json' } },
    (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => console.log('Response:', responseData));
    }
);

req.write(data);
req.end();
