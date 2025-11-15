exports.handler = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID || 'sb';
  const url = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&components=buttons`;
  return { statusCode: 200, body: JSON.stringify({ url }) };
};