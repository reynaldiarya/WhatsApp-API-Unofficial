const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { generateSecureToken } = require('../src/utils/security');

// Helper to wait for server to start if needed (though supertest handles this mostly)
async function runTests() {
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'silent'; // Keep logs clean during tests
  process.env.TOKEN_FILE = path.join(__dirname, '../data/test_token.txt');

  const app = require('../src/index'); // Refactored entry point
  // but typically requiring express app is fine.
  // In our auth.js, we call app.listen() at the end.
  // For true testing, we should export app before app.listen.

  // Wait a bit for the file to be written
  await new Promise((resolve) => setTimeout(resolve, 500));

  const token = fs.readFileSync(process.env.TOKEN_FILE, 'utf8').trim();
  console.log('Testing with token:', token);

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ ${name}`);
      console.error(err);
      failed++;
    }
  };

  await test('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.status !== 'ok') throw new Error(`Expected ok, got ${res.body.status}`);
  });

  await test('GET /auth with correct token returns 200', async () => {
    const res = await request(app).get('/auth').set('Authorization', token);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.text !== 'Authorized') throw new Error(`Expected "Authorized", got "${res.text}"`);
  });

  await test('GET /auth with incorrect token returns 401', async () => {
    const res = await request(app).get('/auth').set('Authorization', 'wrong-token');
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    if (res.body.meta !== 'Not Authorized')
      throw new Error(`Expected "Not Authorized", got "${res.body.meta}"`);
  });

  await test('GET /auth with no token returns 401', async () => {
    const res = await request(app).get('/auth');
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);

  // Cleanup
  if (fs.existsSync(process.env.TOKEN_FILE)) {
    fs.unlinkSync(process.env.TOKEN_FILE);
  }

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
