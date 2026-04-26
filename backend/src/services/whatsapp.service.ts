import axios from 'axios';

/**
 * Sends a WhatsApp message using a SPECIFIC client's token and ID.
 * This makes the app "SaaS-Ready" so different institutes use different numbers.
 */
export const sendWhatsAppMessage = async (params: { 
  to: string, 
  message: string, 
  token?: string, 
  phoneId?: string 
}) => {
  const { to, message, token, phoneId } = params;

  // Use provided token/ID, or fallback to environment variables (for backward compatibility)
  const finalToken = token || process.env.WHATSAPP_API_TOKEN;
  const finalPhoneId = phoneId || process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!finalToken || !finalPhoneId) {
    console.error('ERROR: Missing WhatsApp Token or Phone ID for delivery.');
    return;
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${finalPhoneId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${finalToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error sending message to ${to}:`, error.response?.data || error.message);
    throw error;
  }
};
