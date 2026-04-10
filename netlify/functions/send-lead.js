const https = require('https');

exports.handler = async function(event) {
  if(event.httpMethod === 'OPTIONS') {
    return { statusCode:200, headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST, OPTIONS"}, body:"" };
  }
  if(event.httpMethod !== 'POST') return {statusCode:405, body:'Method Not Allowed'};

  try {
    const { name, email, profil, datum } = JSON.parse(event.body);

    const msg = {
      personalizations: [{ to: [{ email: process.env.LEAD_EMAIL }] }],
      from: { email: process.env.LEAD_EMAIL },
      subject: 'Neues GIRM-Profil: ' + name,
      content: [{
        type: 'text/plain',
        value: 'Name: ' + name + '\nE-Mail: ' + email + '\nDatum: ' + datum + '\n\nProfil:\n' + profil
      }]
    };

    await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.SENDGRID_API_KEY
      },
      body: JSON.stringify(msg)
    });

    return {
      statusCode: 200,
      headers: {"Access-Control-Allow-Origin": "*"},
      body: JSON.stringify({ok: true})
    };
  } catch(e) {
    return {statusCode:500, body: JSON.stringify({error: e.message})};
  }
};
