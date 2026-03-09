const http = require('http');

const pages = [
  '/',
  '/login',
  '/signup',
  '/dashboard/user',
  '/dashboard/admin',
  '/api/stories',
  '/api/auth/session'
];

async function testPage(page) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${page}`, (res) => {
      console.log(`${page}: ${res.statusCode} ${res.statusMessage}`);
      resolve();
    });
    req.on('error', (e) => {
      console.log(`${page}: Error - ${e.message}`);
      resolve();
    });
    req.end();
  });
}

async function testAll() {
  console.log('Testing pages...\n');
  for (const page of pages) {
    await testPage(page);
  }
  console.log('\nDone!');
}

testAll();