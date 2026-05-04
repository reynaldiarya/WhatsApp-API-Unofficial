const request = require('supertest');
const path = require('path');
const fs = require('fs');

async function runTests() {
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'silent';
  process.env.TOKEN_FILE = path.join(process.cwd(), 'auth', 'data', 'token.test.txt');
  process.env.MAIN_NUMBER = '6281234567890';

  const app = require('../src/index');

  // Wait for token generation
  await new Promise((r) => setTimeout(r, 1000));
  const token = fs.readFileSync(process.env.TOKEN_FILE, 'utf8').trim();

  console.log('Testing WhatsApp API with token:', token);

  let status = 0;

  try {
    // Health check
    const resHealth = await request(app).get('/health');
    if (resHealth.status === 200) console.log('✅ GET /health passed');
    else throw new Error('Health check failed');

    // Authorized
    const resAuth = await request(app).get('/auth').set('Authorization', token);
    if (resAuth.status === 200 && resAuth.text === 'Authorized')
      console.log('✅ GET /auth (authorized) passed');
    else throw new Error('Authorized check failed');

    // Unauthorized (wrong token)
    const resUnauth = await request(app).get('/auth').set('Authorization', 'wrong-token');
    if (resUnauth.status === 401) console.log('✅ GET /auth (unauthorized - wrong token) passed');
    else throw new Error('Unauthorized check failed');

    // Unauthorized (no token)
    const resNoAuth = await request(app).get('/auth');
    if (resNoAuth.status === 401) console.log('✅ GET /auth (unauthorized - no token) passed');
    else throw new Error('Unauthorized no-token check failed');
  } catch (err) {
    console.error('❌ Tests failed:', err.message);
    status = 1;
  }

  if (fs.existsSync(process.env.TOKEN_FILE)) fs.unlinkSync(process.env.TOKEN_FILE);
  process.exit(status);
}

runTests().catch(console.error);
