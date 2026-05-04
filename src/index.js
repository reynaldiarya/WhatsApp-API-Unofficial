require('dotenv').config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const pino = require('pino');
const { generateSecureToken, timingSafeCompare } = require('./utils/security');
const { normalizePhone } = require('./utils/phone');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 3000;
const tokenFile = process.env.TOKEN_FILE || '/auth/data/token.txt';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

let token;

function getOrCreateToken() {
  try {
    if (fs.existsSync(tokenFile)) {
      token = fs.readFileSync(tokenFile, 'utf8').trim();
      logger.info('Loaded existing token from file');
    } else {
      token = generateSecureToken();
      const dir = path.dirname(tokenFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(tokenFile, token);
      logger.info('Generated and saved new secure token');
    }
  } catch (error) {
    logger.error({ msg: 'Error handling token', error: error.message });
    token = generateSecureToken();
  }
  return token;
}

token = getOrCreateToken();

// WhatsApp Client Setup
const client = new Client({
  authStrategy: new LocalAuth(),
  webVersionCache: {
    type: 'remote',
    remotePath:
      'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1038711718-alpha.html',
  },
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--no-zygote',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-default-apps',
      '--disable-sync',
      '--disable-translate',
      '--disable-web-security',
      '--disable-features=site-per-process',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certificate-errors',
      '--ignore-certificate-errors-spki-list',
      '--disable-gpu',
      '--disable-webgl',
    ],
  },
});

client.on('qr', (qr) => {
  logger.info('QR Code received, scan it with your phone:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  logger.info('WhatsApp Client is ready!');
});

client.on('message', async (message) => {
  if (process.env.AUTOREPLY !== 'true') return;
  const mainNumber = process.env.MAIN_NUMBER || '+6281234567890';
  message.reply(
    `Terima kasih sudah menghubungi kami.\n` +
      `Untuk layanan lebih lanjut, silakan WhatsApp ke nomor utama kami di:\n` +
      `https://wa.me/${normalizePhone(mainNumber)}\n` +
      `Kami siap membantu Anda!`
  );
});

client.on('disconnected', (reason) => {
  logger.warn({ msg: 'WhatsApp Client disconnected', reason });
});

// Express Setup
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  req.log = logger;
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${Date.now() - start}ms`,
    });
  });
  next();
});

// API Routes
app.post('/api/send', async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!timingSafeCompare(authHeader, token)) {
    return res.status(401).json({ status: false, message: 'Error', meta: 'Not Authorized' });
  }

  try {
    const { phone, message } = req.body;
    if (!phone || !message) {
      return res.status(400).json({
        status: false,
        message: 'Error',
        meta: 'Phone and message are required',
      });
    }

    const normalizedPhone = normalizePhone(phone);
    const chatId = normalizedPhone + '@c.us';

    const response = await client.sendMessage(chatId, message);
    res.status(200).json({ status: true, message: 'Success', meta: response });
  } catch (err) {
    next(err);
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/status', (req, res) => {
  res.status(200).json({
    status: 'online',
    token_preview: token.substring(0, 8) + '...',
    whatsapp_ready: client.info ? true : false,
  });
});

app.use(errorHandler);

const server = app.listen(port, () => {
  logger.info(`Server ready at http://localhost:${port}`);
  logger.info(`Token for authorization: ${token}`);
});

// Initialize Client
client.initialize();

// Graceful Shutdown
const shutdown = async () => {
  logger.info('Shutting down...');
  try {
    await client.destroy();
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  } catch (err) {
    logger.error({ msg: 'Error during shutdown', error: err.message });
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
