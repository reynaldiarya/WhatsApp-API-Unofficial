const request = require('supertest');
const path = require('path');
const fs = require('fs');

async function runTests() {
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'silent';
  process.env.MAIN_NUMBER = '6281234567890';

  const app = require('../src/index');

  console.log('Testing WhatsApp API endpoints (No Auth)...');

  let status = 0;

  try {
    // Health check
    const resHealth = await request(app).get('/health');
    if (resHealth.status === 200) console.log('✅ GET /health passed');
    else throw new Error('Health check failed');

    // Status check
    const resStatus = await request(app).get('/status');
    if (resStatus.status === 200) console.log('✅ GET /status passed');
    else throw new Error('Status check failed');
  } catch (err) {
    console.error('❌ Tests failed:', err.message);
    status = 1;
  }

  process.exit(status);
}

runTests().catch(console.error);
