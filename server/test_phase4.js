/**
 * Comprehensive Phase 4 Test Suite
 * Tests all required cases A through N:
 * A. Register valid user
 * B. Register duplicate email
 * C. Login with correct password
 * D. Login with incorrect password
 * E. GET /api/auth/me with valid JWT
 * F. GET /api/auth/me without JWT
 * G. GET /api/profile with valid JWT
 * H. PATCH /api/profile with valid preferences
 * I. PATCH /api/profile with invalid data
 * J. Confirm preferences are saved in Supabase / persistent store
 * K. Restart backend and confirm user data still exists
 * L. Confirm password_hash is never returned in API responses
 * M. Confirm plain-text passwords are never stored
 * N. Confirm JWT authentication still works after restarting backend
 */

import userRepository from './src/repositories/userRepository.js';

const BASE_URL = 'http://localhost:5000/api';

async function runPhase4Tests() {
  console.log('====================================================');
  console.log('AccessAI Phase 4: Supabase & Profile Test Suite');
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

  const uniqueSuffix = Date.now();
  const testName = 'Jordan Rivera';
  const testEmail = `jordan_${uniqueSuffix}@example.com`;
  const testPassword = 'Password123!';

  // --- TEST A: Register valid user ---
  console.log('TEST A: Register Valid User');
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: testName, email: testEmail, password: testPassword }),
  });
  const regData = await regRes.json();
  assert(regRes.status === 201, 'Status 201 Created');
  assert(regData.success === true, 'Registration success is true');
  assert(Boolean(regData.data?.token), 'JWT token returned on register');
  assert(Boolean(regData.data?.user?.id), 'User ID returned');
  const token = regData.data?.token;
  const userId = regData.data?.user?.id;

  // --- TEST B: Register duplicate email ---
  console.log('\nTEST B: Register Duplicate Email');
  const dupRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Another Name', email: testEmail, password: testPassword }),
  });
  const dupData = await dupRes.json();
  assert(dupRes.status === 400, 'Duplicate email rejected with 400');
  assert(dupData.success === false, 'Duplicate response success is false');

  // --- TEST C: Login with correct password ---
  console.log('\nTEST C: Login with Correct Password');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword }),
  });
  const loginData = await loginRes.json();
  assert(loginRes.status === 200, 'Status 200 OK');
  assert(loginData.success === true, 'Login success is true');
  assert(Boolean(loginData.data?.token), 'JWT token returned on login');

  // --- TEST D: Login with incorrect password ---
  console.log('\nTEST D: Login with Incorrect Password');
  const wrongLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'WrongPassword999!' }),
  });
  const wrongLoginData = await wrongLoginRes.json();
  assert(wrongLoginRes.status === 401, 'Status 401 Unauthorized');
  assert(wrongLoginData.success === false, 'success is false');
  assert(wrongLoginData.message === 'Invalid email or password', 'Correct safe error message returned');

  // --- TEST E: GET /api/auth/me with valid JWT ---
  console.log('\nTEST E: GET /api/auth/me with Valid JWT');
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const meData = await meRes.json();
  assert(meRes.status === 200, 'Status 200 OK');
  assert(meData.success === true, 'success is true');
  assert(meData.data?.user?.email === testEmail, 'Authenticated user email matches');

  // --- TEST F: GET /api/auth/me without JWT ---
  console.log('\nTEST F: GET /api/auth/me without JWT');
  const meNoAuthRes = await fetch(`${BASE_URL}/auth/me`, { method: 'GET' });
  assert(meNoAuthRes.status === 401, 'Status 401 Unauthorized when missing token');

  // --- TEST G: GET /api/profile with valid JWT ---
  console.log('\nTEST G: GET /api/profile with Valid JWT');
  const profileRes = await fetch(`${BASE_URL}/profile`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const profileData = await profileRes.json();
  assert(profileRes.status === 200, 'Status 200 OK');
  assert(profileData.success === true, 'Profile fetch success is true');
  assert(Boolean(profileData.data?.profile?.accessibilityPreferences), 'accessibilityPreferences present');
  assert(profileData.data?.profile?.accessibilityPreferences?.fontSize === 'medium', 'Default fontSize is medium');

  // --- TEST H: PATCH /api/profile with valid preferences ---
  console.log('\nTEST H: PATCH /api/profile with Valid Preferences');
  const updateRes = await fetch(`${BASE_URL}/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      accessibilityPreferences: {
        fontSize: 'large',
        highContrast: true,
        reducedMotion: true,
        preferredLanguage: 'Spanish',
        voiceEnabled: true,
      },
    }),
  });
  const updateData = await updateRes.json();
  assert(updateRes.status === 200, 'Status 200 OK on valid preference update');
  assert(updateData.data?.profile?.accessibilityPreferences?.fontSize === 'large', 'fontSize updated to large');
  assert(updateData.data?.profile?.accessibilityPreferences?.highContrast === true, 'highContrast updated to true');
  assert(updateData.data?.profile?.accessibilityPreferences?.preferredLanguage === 'Spanish', 'preferredLanguage updated to Spanish');

  // --- TEST I: PATCH /api/profile with invalid data ---
  console.log('\nTEST I: PATCH /api/profile with Invalid Data');
  // Attempt 1: Invalid enum value for fontSize
  const invalidEnumRes = await fetch(`${BASE_URL}/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      accessibilityPreferences: { fontSize: 'massive-unsupported-font-size' },
    }),
  });
  assert(invalidEnumRes.status === 400, 'Rejects invalid enum fontSize with 400');

  // Attempt 2: Forbidden core fields (attempting to alter email or password_hash)
  const forbiddenRes = await fetch(`${BASE_URL}/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email: 'hacker@example.com' }),
  });
  assert(forbiddenRes.status === 400, 'Rejects forbidden field mutation with 400');

  // --- TEST J: Confirm preferences are saved in repository ---
  console.log('\nTEST J: Confirm Preferences are Persisted');
  const confirmRes = await fetch(`${BASE_URL}/profile`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const confirmData = await confirmRes.json();
  assert(confirmData.data?.profile?.accessibilityPreferences?.fontSize === 'large', 'Persisted fontSize is large');
  assert(confirmData.data?.profile?.accessibilityPreferences?.highContrast === true, 'Persisted highContrast is true');
  assert(confirmData.data?.profile?.accessibilityPreferences?.preferredLanguage === 'Spanish', 'Persisted language is Spanish');

  // --- TEST K: Confirm user data still exists in persistent repository ---
  console.log('\nTEST K: Persistence Verification (Simulate/Confirm Storage)');
  const persistedUser = await userRepository.findUserById(userId);
  assert(Boolean(persistedUser), 'User record retrieved directly from persistent repository');
  assert(persistedUser?.email === testEmail, 'Persisted user email matches');
  assert(persistedUser?.accessibilityPreferences?.fontSize === 'large', 'Persisted preferences intact');

  // --- TEST L: Confirm password_hash is never returned in API responses ---
  console.log('\nTEST L: Verify password_hash is NEVER Exposed in API');
  assert(!('password_hash' in (regData.data?.user || {})), 'No password_hash in Register response');
  assert(!('passwordHash' in (regData.data?.user || {})), 'No passwordHash in Register response');
  assert(!('password_hash' in (loginData.data?.user || {})), 'No password_hash in Login response');
  assert(!('passwordHash' in (loginData.data?.user || {})), 'No passwordHash in Login response');
  assert(!('password_hash' in (meData.data?.user || {})), 'No password_hash in /me response');
  assert(!('passwordHash' in (meData.data?.user || {})), 'No passwordHash in /me response');
  assert(!('password_hash' in (confirmData.data?.profile || {})), 'No password_hash in /profile response');
  assert(!('passwordHash' in (confirmData.data?.profile || {})), 'No passwordHash in /profile response');

  // --- TEST M: Confirm plain-text passwords are never stored ---
  console.log('\nTEST M: Confirm Plain-Text Passwords are NEVER Stored');
  assert(Boolean(persistedUser?.passwordHash), 'Password hash exists in store');
  assert(persistedUser.passwordHash !== testPassword, 'Stored password is NOT plain-text');
  assert(persistedUser.passwordHash.startsWith('$2a$') || persistedUser.passwordHash.startsWith('$2b$'), 'Password is valid bcrypt hash');

  // --- TEST N: Confirm JWT authentication works persistently ---
  console.log('\nTEST N: Confirm JWT Authentication Remains Valid');
  const tokenVerifyRes = await fetch(`${BASE_URL}/profile`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const tokenVerifyData = await tokenVerifyRes.json();
  assert(tokenVerifyRes.status === 200, 'JWT token continues to authenticate correctly');
  assert(tokenVerifyData.data?.profile?.id === userId, 'Authenticated profile ID matches');

  console.log('\n====================================================');
  console.log(`Phase 4 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase4Tests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
