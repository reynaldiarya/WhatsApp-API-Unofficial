const request = require('supertest');
const path = require('path');
const fs = require('fs');

async function runTests() {
    process.env.NODE_ENV = 'test';
    process.env.LOG_LEVEL = 'silent';
    process.env.TOKEN_FILE = path.join(__dirname, '../src/data/test_api_token.txt');
    process.env.MAIN_NUMBER = '6281234567890';

    const app = require('../src/index');
    
    // Wait for token generation
    await new Promise(r => setTimeout(r, 1000));
    const token = fs.readFileSync(process.env.TOKEN_FILE, 'utf8').trim();

    console.log('Testing WhatsApp API with token:', token);

    let status = 0;

    try {
        // Health check
        const resHealth = await request(app).get('/health');
        if (resHealth.status === 200) console.log('✅ GET /health passed');
        else throw new Error('Health check failed');

        // Unauthorized
        const resUnauth = await request(app).post('/api/send').send({ phone: '123', message: 'hi' });
        if (resUnauth.status === 401) console.log('✅ POST /api/send (unauthorized) passed');
        else throw new Error('Unauthorized check failed');

        // Status check
        const resStatus = await request(app).get('/status');
        if (resStatus.status === 200) console.log('✅ GET /status passed');
        else throw new Error('Status check failed');

    } catch (err) {
        console.error('❌ Tests failed:', err.message);
        status = 1;
    }

    if (fs.existsSync(process.env.TOKEN_FILE)) fs.unlinkSync(process.env.TOKEN_FILE);
    process.exit(status);
}

runTests().catch(console.error);
