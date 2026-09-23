/**
 * Authentication Test Runner for AccessAI (Node.js Fetch)
 * Tests:
 * - Register: valid, invalid email, short password, duplicate email
 * - Login: valid, wrong password, unknown email
 * - Protected Route: no token, invalid token, valid token
 */

const BASE_URL = 'http://localhost:5000/api/auth';

async function runTests() {
  console.log('====================================================');
  console.log('Starting Phase 3 Authentication Test Suite');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. REGISTER - Invalid Email
  console.log('TEST 1: Register with Invalid Email');
  const regInvalidEmailRes = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alice', email: 'not-an-email', password: 'Password123' }),
  });
  const regInvalidEmailData = await regInvalidEmailRes.json();
  assert(regInvalidEmailRes.status === 400, 'HTTP status is 400');
  assert(regInvalidEmailData.success === false, 'success is false');
  assert(regInvalidEmailData.message === 'Validation failed', 'message is "Validation failed"');
  assert(Array.isArray(regInvalidEmailData.errors), 'errors array returned');

  // 2. REGISTER - Short Password
  console.log('\nTEST 2: Register with Short Password (< 8 chars)');
  const regShortPassRes = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alice', email: 'alice@example.com', password: 'short' }),
  });
  const regShortPassData = await regShortPassRes.json();
  assert(regShortPassRes.status === 400, 'HTTP status is 400');
  assert(regShortPassData.success === false, 'success is false');

  const uniqueId = Date.now();
  const testEmail = `alice_${uniqueId}@example.com`;

  // 3. REGISTER - Valid Registration
  console.log('\nTEST 3: Register Valid User');
  const regValidRes = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alice Walker', email: testEmail, password: 'Password123' }),
  });
  const regValidData = await regValidRes.json();
  assert(regValidRes.status === 201, 'HTTP status is 201 Created');
  assert(regValidData.success === true, 'success is true');
  assert(regValidData.data && regValidData.data.token, 'JWT token returned');
  assert(regValidData.data && regValidData.data.user && regValidData.data.user.email === testEmail, 'user profile returned');
  assert(!regValidData.data.user.passwordHash, 'passwordHash is NOT exposed');
  const token = regValidData.data ? regValidData.data.token : null;

  // 4. REGISTER - Duplicate Email
  console.log('\nTEST 4: Register Duplicate Email');
  const regDuplicateRes = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alice Duplicate', email: testEmail, password: 'Password123' }),
  });
  const regDuplicateData = await regDuplicateRes.json();
  assert(regDuplicateRes.status === 400, 'HTTP status is 400 Bad Request');
  assert(regDuplicateData.success === false, 'Duplicate email rejected');

  // 5. LOGIN - Wrong Password
  console.log('\nTEST 5: Login with Wrong Password');
  const loginWrongPassRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'IncorrectPassword999' }),
  });
  const loginWrongPassData = await loginWrongPassRes.json();
  assert(loginWrongPassRes.status === 401, 'HTTP status is 401 Unauthorized');
  assert(loginWrongPassData.success === false, 'success is false');
  assert(loginWrongPassData.message === 'Invalid email or password', 'message is "Invalid email or password"');

  // 6. LOGIN - Unknown Email
  console.log('\nTEST 6: Login with Unknown Email');
  const loginUnknownRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: `nonexistent_${uniqueId}@example.com`, password: 'Password123' }),
  });
  const loginUnknownData = await loginUnknownRes.json();
  assert(loginUnknownRes.status === 401, 'HTTP status is 401 Unauthorized');
  assert(loginUnknownData.success === false, 'Unknown email rejected');

  // 7. LOGIN - Valid Credentials
  console.log('\nTEST 7: Login with Valid Credentials');
  const loginValidRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'Password123' }),
  });
  const loginValidData = await loginValidRes.json();
  assert(loginValidRes.status === 200, 'HTTP status is 200 OK');
  assert(loginValidData.success === true, 'success is true');
  assert(loginValidData.data && loginValidData.data.token, 'JWT token returned on login');
  assert(!loginValidData.data.user.passwordHash, 'passwordHash is NOT exposed');

  // 8. PROTECTED ROUTE - No Token
  console.log('\nTEST 8: Protected Route (/api/auth/me) with No Token');
  const meNoTokenRes = await fetch(`${BASE_URL}/me`, { method: 'GET' });
  const meNoTokenData = await meNoTokenRes.json();
  assert(meNoTokenRes.status === 401, 'HTTP status is 401 Unauthorized');
  assert(meNoTokenData.success === false, 'success is false');

  // 9. PROTECTED ROUTE - Invalid Token
  console.log('\nTEST 9: Protected Route (/api/auth/me) with Invalid Token');
  const meInvalidTokenRes = await fetch(`${BASE_URL}/me`, {
    method: 'GET',
    headers: { Authorization: 'Bearer this.is.an.invalid.token' },
  });
  const meInvalidTokenData = await meInvalidTokenRes.json();
  assert(meInvalidTokenRes.status === 401, 'HTTP status is 401 Unauthorized');
  assert(meInvalidTokenData.success === false, 'Invalid token rejected');

  // 10. PROTECTED ROUTE - Valid Token
  console.log('\nTEST 10: Protected Route (/api/auth/me) with Valid Token');
  const meValidRes = await fetch(`${BASE_URL}/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const meValidData = await meValidRes.json();
  assert(meValidRes.status === 200, 'HTTP status is 200 OK');
  assert(meValidData.success === true, 'success is true');
  assert(meValidData.data && meValidData.data.user && meValidData.data.user.email === testEmail, 'Authenticated user returned');
  assert(!meValidData.data.user.passwordHash, 'passwordHash omitted from profile');

  console.log('\n====================================================');
  console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
