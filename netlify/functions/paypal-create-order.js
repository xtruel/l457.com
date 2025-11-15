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
    const payload = JSON.parse(event.body || '{}');
    const items = Array.isArray(payload.items) ? payload.items : [];
    if (!items.length) return { statusCode: 400, body: 'No items' };

    const total = items.reduce((s, i) => s + (Number(i.price) || 0) * (i.quantity || 1), 0);
    const access = await getAccessToken();
    const token = access.access_token;

    const orderRes = await fetch(baseUrl() + '/v2/checkout/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: 'EUR', value: total.toFixed(2) } }],
        application_context: { shipping_preference: 'GET_FROM_FILE' }
      })
    });
    const data = await orderRes.json();
    return { statusCode: 200, body: JSON.stringify({ id: data.id }) };
  } catch (e) {
    return { statusCode: 500, body: 'Error' };
  }
};