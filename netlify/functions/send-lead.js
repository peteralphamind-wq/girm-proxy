exports.handler = async function(event) {
  if(event.httpMethod === 'OPTIONS') {
    return { statusCode:200, headers:{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST, OPTIONS"}, body:"" };
  }
  if(event.httpMethod !== 'POST') return {statusCode:405, body:'Method Not Allowed'};
  try {
    const { name, email, profil, datum } = JSON.parse(event.body);
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.RESEND_API_KEY
      },
      body: JSON.stringify({
        from: 'GIRM Tool <onboarding@resend.dev>',
        to: [process.env.LEAD_EMAIL],
        subject: 'Neues GIRM-Profil: ' + name,
        text: 'Name: ' + name + '\nE-Mail: ' + email + '\nDatum: ' + datum + '\n\nProfil:\n' + profil
      })
    });
    const data = await res.json();
    return { statusCode:200, headers:{"Access-Control-Allow-Origin":"*"}, body: JSON.stringify({ok:true, data}) };
  } catch(e) {
    return {statusCode:500, body: JSON.stringify({error: e.message})};
  }
};
