const https = require('https');

exports.handler = async function(event) {
  if(event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: ""
    };
  }
  if(event.httpMethod !== 'POST') return {statusCode: 405, body: 'Method Not Allowed'};

  try {
    const { name, email, datum, profil } = JSON.parse(event.body);

    const payload = JSON.stringify({
      name: name,
      email: email,
      _subject: "Neues GIRM-Profil: " + name,
      Datum: datum,
      Profil: profil
    });

    const result = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: 'formspree.io',
        path: '/f/xwvwdqop',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({status: res.statusCode, body: data}));
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });

    console.log('Formspree response:', result.status, result.body);

    return {
      statusCode: 200,
      headers: {"Access-Control-Allow-Origin": "*"},
      body: JSON.stringify({ok: true})
    };
  } catch(e) {
    console.log('Error:', e.message);
    return {statusCode: 500, body: JSON.stringify({error: e.message})};
  }
};
