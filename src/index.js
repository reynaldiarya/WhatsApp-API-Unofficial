require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const pino = require('pino');
const { generateSecureToken, timingSafeCompare } = require('./utils/security');
const errorHandler = require('./middleware/errorHandler');


const app = express();
const port = process.env.PORT || 5000;
const tokenFile = process.env.TOKEN_FILE || '/auth/data/token.txt';

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: { colorize: true }
    }
});

// Security & Utility Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    req.log = logger;
    const start = Date.now();
    res.on('finish', () => {
        logger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${Date.now() - start}ms`
        });
    });
    next();
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
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(tokenFile, token);
            logger.info('Generated and saved new secure token');
        }
    } catch (error) {
        logger.error({ msg: 'Error handling token', error: error.message });
        // Fallback to in-memory only if file fails
        token = generateSecureToken();
    }
    return token;
}

token = getOrCreateToken();
logger.info(`Server ready with token: ${token}`);

// Authentication endpoint for Nginx auth_request
app.get('/auth', (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (timingSafeCompare(authHeader, token)) {
        res.status(200).send('Authorized');
    } else {
        res.status(401).json({
            status: false,
            message: 'Error',
            meta: 'Not Authorized'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global Error Handler
app.use(errorHandler);

if (require.main === module) {
    const server = app.listen(port, () => {
        logger.info(`Auth service listening on port ${port}`);
    });

    // Graceful shutdown
    const shutdown = () => {
        logger.info('Shutting down server...');
        server.close(() => {
            logger.info('Server closed');
            process.exit(0);
        });

        // Force exit after 10s
        setTimeout(() => {
            logger.error('Forcefully shutting down');
            process.exit(1);
        }, 10000);
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}

module.exports = app;