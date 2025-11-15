const fetch = require('node-fetch');

function baseUrl() {
  return process.env.PAYPAL_ENV === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
}

async function getAccessToken() {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const res = await fetch(baseUrl() + '/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(id + ':' + secret).toString('base64')
    },
    body: 'grant_type=client_credentials'
  });
  return res.json();
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const { orderId } = JSON.parse(event.body || '{}');
    if (!orderId) return { statusCode: 400, body: 'Missing orderId' };
    const access = await getAccessToken();
    const token = access.access_token;
    const res = await fetch(baseUrl() + `/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    const EU = new Set(['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE']);
    const ship = data && data.purchase_units && data.purchase_units[0] && data.purchase_units[0].shipping;
    const cc = ship && ship.address && ship.address.country_code;
    if (cc && !EU.has(cc)) {
      return { statusCode: 400, body: 'Non-EU shipping not allowed' };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, data }) };
  } catch (e) {
    return { statusCode: 500, body: 'Error' };
  }
};