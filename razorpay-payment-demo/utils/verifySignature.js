const crypto = require("crypto");

exports.verifyPaymentSignature = (
  order_id,
  payment_id,
  signature,
  secret
) => {
  const body = order_id + "|" + payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === signature;
};

exports.verifyWebhookSignature = (body, signature, secret) => {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
};