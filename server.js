const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration
const API_TOKEN = 'apit-P2qoElxkBdK3Sy78b3pe9APHCF5qNrkt-hyFLJ';
const SENDER_ID = 'SA!R';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to send SMS via MoceanAPI
async function sendMoceanSMS(to, text) {
  const params = new URLSearchParams();
  params.append('mocean-from', SENDER_ID);
  params.append('mocean-to', to);
  params.append('mocean-text', text);

  const response = await fetch('https://rest.moceanapi.com/rest/2/sms', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  return await response.json();
}

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Endpoint to handle sending 10 messages (1 OTP + 9 Notes)
app.post('/api/send-otps', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, error: 'Phone number is required.' });
  }

  // Clean phone number (remove spaces and non-numeric characters except +)
  const cleanNumber = phoneNumber.replace(/[^\d]/g, '');

  const generatedOTP = generateOTP();
  const results = [];

  // Define the 10 messages (1 OTP + 9 Notes)
  const messages = [
    `[SA!R] Your OTP code is: ${generatedOTP}. Valid for 10 minutes.`,
    `[SA!R Note 1] Welcome to the SA!R platform dashboard!`,
    `[SA!R Note 2] Keep your credentials safe and secure.`,
    `[SA!R Note 3] Enjoy seamless multi-message routing.`,
    `[SA!R Note 4] System performance is operating at 100%.`,
    `[SA!R Note 5] Need support? Visit our help section anytime.`,
    `[SA!R Note 6] Check your dashboard for real-time status updates.`,
    `[SA!R Note 7] Security alert: Never share your OTP with anyone.`,
    `[SA!R Note 8] Thank you for choosing SA!R services.`,
    `[SA!R Note 9] Session initialized successfully.`
  ];

  try {
    // Dispatch all 10 messages
    for (let i = 0; i < messages.length; i++) {
      const apiResponse = await sendMoceanSMS(cleanNumber, messages[i]);
      results.push({
        index: i + 1,
        type: i === 0 ? 'OTP Message' : `Note Message ${i}`,
        content: messages[i],
        response: apiResponse
      });
    }

    return res.json({
      success: true,
      otp: generatedOTP,
      recipient: cleanNumber,
      totalSent: results.length,
      details: results
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`SA!R Server running on http://localhost:${PORT}`);
});
