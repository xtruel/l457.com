const Stripe = require('stripe');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let origin = event.headers.origin || '';
  if (!origin && event.headers.host) {
    origin = `https://${event.headers.host}`;
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const items = Array.isArray(payload.items) ? payload.items : [];
    if (!items.length) {
      return { statusCode: 400, body: 'No items' };
    }

    const EU = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map((i) => ({ price: i.priceId, quantity: i.quantity || 1 })),
      shipping_address_collection: { allowed_countries: EU },
      phone_number_collection: { enabled: true },
      automatic_tax: { enabled: true },
      allow_promotion_codes: true,
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancel`
    });

    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (e) {
    return { statusCode: 500, body: 'Error' };
  }
};