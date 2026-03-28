// Use createRequire for CommonJS compatibility in ESM
import { createRequire } from 'module';
import { config } from 'dotenv';
import { resolve } from 'path';

const require = createRequire(import.meta.url);
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

let client = null;
let isReady = false;
let isInitializing = false;

// Pre-initialize WhatsApp on module load (optional)
// This ensures WhatsApp is ready when needed
export function preInitializeWhatsApp() {
  if (!isInitializing && !isReady) {
    console.log('📱 [WhatsApp] Pre-initializing WhatsApp client...');
    initializeWhatsApp().catch((error) => {
      console.error('📱 [WhatsApp] Pre-initialization failed:', error);
    });
  }
}

// Initialize WhatsApp client
export function initializeWhatsApp() {
  return new Promise((resolve, reject) => {
    if (client && isReady) {
      resolve(client);
      return;
    }

    if (isInitializing) {
      // Wait for initialization
      const checkInterval = setInterval(() => {
        if (isReady && client) {
          clearInterval(checkInterval);
          resolve(client);
        }
      }, 500);
      return;
    }

    isInitializing = true;

    client = new Client({
      authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth',
      }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });

    client.on('qr', (qr) => {
      console.log('WhatsApp QR Code - Scan this with your phone:');
      qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
      console.log('WhatsApp client is ready!');
      isReady = true;
      isInitializing = false;
      if (client) resolve(client);
    });

    client.on('authenticated', () => {
      console.log('WhatsApp authenticated');
    });

    client.on('auth_failure', (msg) => {
      console.error('WhatsApp authentication failed:', msg);
      isInitializing = false;
      reject(new Error('WhatsApp authentication failed'));
    });

    client.on('disconnected', (reason) => {
      console.log('WhatsApp client disconnected:', reason);
      isReady = false;
      client = null;
    });

    client.initialize().catch((error) => {
      console.error('Error initializing WhatsApp:', error);
      isInitializing = false;
      reject(error);
    });
  });
}

// Send WhatsApp message
export async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    console.log('📱 [WhatsApp] Starting to send message...');
    console.log('📱 [WhatsApp] Phone number received:', phoneNumber);
    
    // Format phone number (remove any non-digit characters, add country code if needed)
    let formattedNumber = phoneNumber.replace(/\D/g, '');
    
    // Remove leading + if present
    if (formattedNumber.startsWith('+')) {
      formattedNumber = formattedNumber.substring(1);
    }
    
    // If number doesn't start with country code, assume it's a local number
    // For Morocco, add 212 if not present
    if (!formattedNumber.startsWith('212') && formattedNumber.length <= 9) {
      formattedNumber = '212' + formattedNumber;
    }
    
    // WhatsApp format: country code + number (no +, no spaces, no leading 0)
    const chatId = `${formattedNumber}@c.us`;
    
    console.log('📱 [WhatsApp] Formatted number:', formattedNumber);
    console.log('📱 [WhatsApp] Chat ID:', chatId);
    
    // Initialize and wait for client to be ready
    console.log('📱 [WhatsApp] Initializing client...');
    const whatsappClient = await initializeWhatsApp();
    
    if (!whatsappClient) {
      throw new Error('WhatsApp client is null');
    }
    
    if (!isReady) {
      console.log('📱 [WhatsApp] Client not ready yet, waiting...');
      // Wait up to 30 seconds for client to be ready
      let waitTime = 0;
      while (!isReady && waitTime < 30000) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        waitTime += 1000;
      }
      
      if (!isReady) {
        throw new Error('WhatsApp client not ready after 30 seconds');
      }
    }
    
    console.log('📱 [WhatsApp] Client is ready, sending message...');
    console.log('📱 [WhatsApp] Message preview:', message.substring(0, 100) + '...');
    
    const result = await whatsappClient.sendMessage(chatId, message);
    
    console.log('✅ [WhatsApp] Message sent successfully!');
    console.log('✅ [WhatsApp] Message ID:', result.id._serialized);
    return true;
  } catch (error) {
    console.error('❌ [WhatsApp] Error sending message:', error);
    console.error('❌ [WhatsApp] Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return false;
  }
}

// Format booking message for WhatsApp
export function formatBookingMessage(data) {
  const startDate = new Date(data.startDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const endDate = new Date(data.endDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Calculate number of days
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return `🚗 *NEW BOOKING RECEIVED* 🚗
${data.featuredImage ? `\n📸 ${data.featuredImage}` : ''}

*Car Details:*
🏎️ ${data.carName}
💰 Price: ${data.carPrice || 'N/A'}€/day
${data.carModel ? `📅 Model: ${data.carModel}` : ''}
${data.carTransmission ? `⚙️ Transmission: ${data.carTransmission}` : ''}
${data.carSeats ? `👥 Seats: ${data.carSeats}` : ''}
${data.carFuel ? `⛽ Fuel: ${data.carFuel}` : ''}

*Customer Details:*
👤 Name: ${data.fullName}
📧 Email: ${data.email}
📱 Phone: ${data.phoneNumber}
📍 City: ${data.city}

*Booking Period:*
📅 From: ${startDate}
📅 To: ${endDate}
📆 Duration: ${days} day${days > 1 ? 's' : ''}

Please contact the customer to confirm the booking.`;
}