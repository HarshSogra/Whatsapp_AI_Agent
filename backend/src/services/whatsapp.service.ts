import axios from 'axios';

const WA_TOKEN = process.env.WHATSAPP_API_TOKEN;
const PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export const sendWhatsAppMessage = async (to: string, message: string) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${WA_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    throw error;
  }
};
