const Stripe = require('stripe');
let adminInitialized = false;
let admin, db;

function initAdmin() {
  if (adminInitialized) return;
  const svc = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!svc) return;
  admin = require('firebase-admin');
  const creds = JSON.parse(svc);
  if (!admin.apps.length) {
    admin.initializeApp({ credential: admin.credential.cert(creds) });
  }
  db = admin.firestore();
  adminInitialized = true;
}

exports.handler = async (event) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = event.headers['stripe-signature'];
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;

  let evt;
  try {
    evt = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return { statusCode: 400, body: 'Invalid signature' };
  }

  if (evt.type === 'checkout.session.completed') {
    const session = evt.data.object;
    try {
      initAdmin();
      let items = [];
      try {
        const li = await stripe.checkout.sessions.listLineItems(session.id);
        items = li.data || [];
      } catch (_) {}
      if (db) {
        await db.collection('orders').doc(session.id).set({
          id: session.id,
          amount_total: session.amount_total,
          currency: session.currency,
          payment_status: session.payment_status,
          customer_details: session.customer_details || {},
          metadata: session.metadata || {},
          items,
          created: session.created,
          mode: session.mode
        });
      }
    } catch (_) {}
  }

  return { statusCode: 200, body: 'ok' };
};