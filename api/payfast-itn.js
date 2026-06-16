import https from "https";
import { URLSearchParams } from "url";

const EMAILJS_SERVICE_ID = "service_xkv782o";
const EMAILJS_TEMPLATE_ID = "template_xdxvy08";
const EMAILJS_PUBLIC_KEY = "PKdOU1ehzoxYx1CCY";
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY; // set in Vercel env vars
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL; // your email, set in Vercel env vars

async function sendEmail(order) {
  const templateParams = {
    to_email: NOTIFY_EMAIL,
    order_id: order.m_payment_id || "N/A",
    customer_name: `${order.name_first || ""} ${order.name_last || ""}`.trim(),
    customer_email: order.email_address || "N/A",
    customer_phone: order.cell_number || "N/A",
    amount: `R${order.amount || "0"}`,
    item_name: order.item_name || "N/A",
    item_description: order.item_description || "N/A",
    payment_status: order.payment_status || "N/A",
    pf_payment_id: order.pf_payment_id || "N/A",
  };

  const payload = JSON.stringify({
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    accessToken: EMAILJS_PRIVATE_KEY,
    template_params: templateParams,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "api.emailjs.com",
        path: "/api/v1.0/email/send",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve({ status: res.statusCode, body: data }));
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

async function validateWithPayFast(pfData, pfParamString) {
  // Step 1: Reconstruct param string (already done by caller)
  // Step 2: Validate with PayFast server
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "www.payfast.co.za",
        path: "/eng/query/validate",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(pfParamString),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data.trim() === "VALID"));
      }
    );
    req.on("error", reject);
    req.write(pfParamString);
    req.end();
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const pfData = req.body;

    // Build param string for validation (exclude signature)
    const pfParamString = Object.entries(pfData)
      .filter(([key]) => key !== "signature")
      .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(val).trim())}`)
      .join("&");

    // Validate with PayFast
    const isValid = await validateWithPayFast(pfData, pfParamString);

    if (!isValid) {
      console.error("PayFast ITN validation failed");
      return res.status(400).send("INVALID");
    }

    // Only process completed payments
    if (pfData.payment_status === "COMPLETE") {
      await sendEmail(pfData);
      console.log(`Order #${pfData.m_payment_id} confirmed and email sent.`);
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error("ITN handler error:", err);
    return res.status(500).send("ERROR");
  }
}
