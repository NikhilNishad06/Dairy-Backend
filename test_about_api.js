const axios = require('axios');

async function testAboutApi() {
  try {
    const res = await axios.get('http://localhost:5000/api/about');
    console.log('API Status:', res.status);
    console.log('API Data:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('API Error:', err.message);
    if (err.response) {
      console.error('Response Data:', err.response.data);
    }
  }
}

testAboutApi();
