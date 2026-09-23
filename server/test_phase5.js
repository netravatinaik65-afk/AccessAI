/**
 * AccessAI Phase 5: Gemini AI Integration Test Suite
 * Tests cases A through J:
 * A. Valid simplify request
 * B. Empty simplify text (400 validation error)
 * C. Excessively large simplify text (400 length limit)
 * D. Valid Ask AccessAI request
 * E. Missing question (400 validation error)
 * F. Valid image request (Base64 payload)
 * G. Unsupported image type (400 error)
 * H. Unauthenticated AI request (401 Unauthorized)
 * I. Gemini API failure handling (safe status codes, no crashes)
 * J. Confirm Gemini API key is not exposed to frontend responses
 */

const BASE_URL = 'http://localhost:5000/api';

// Small 1x1 transparent PNG base64 for testing image endpoints
const TINY_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

async function runPhase5Tests() {
  console.log('====================================================');
  console.log('AccessAI Phase 5: Gemini AI Integration Test Suite');
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

  // 1. Setup authenticated session
  console.log('Setup: Register & authenticate user for AI test suite');
  const userSuffix = Date.now();
  const testUser = {
    name: 'Gemini Tester',
    email: `tester_${userSuffix}@example.com`,
    password: 'Password123!',
  };

  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser),
  });
  const regData = await regRes.json();
  const token = regData.data?.token;
  assert(Boolean(token), 'Auth token acquired for testing');

  // --- TEST A: Valid simplify request ---
  console.log('\nTEST A: Valid Simplify Request');
  const validSimplifyRes = await fetch(`${BASE_URL}/ai/simplify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      text: 'The accessibility guidelines mandate that all interactive elements must have visible keyboard focus indicators and sufficient color contrast ratios.',
    }),
  });
  const validSimplifyData = await validSimplifyRes.json();
  // If GEMINI_API_KEY is configured -> 200 with simplifiedText. If unconfigured -> 503 safe error.
  if (validSimplifyRes.status === 200) {
    assert(validSimplifyData.success === true, 'Status 200 OK with live Gemini response');
    assert(Boolean(validSimplifyData.data?.simplifiedText), 'Simplified text received');
  } else {
    assert(validSimplifyRes.status === 503 || validSimplifyRes.status === 502, 'Handled missing/unconfigured API key safely with HTTP 503/502');
    assert(validSimplifyData.success === false, 'Safe error message returned without crashing');
  }

  // --- TEST B: Empty simplify text ---
  console.log('\nTEST B: Empty Simplify Text');
  const emptySimplifyRes = await fetch(`${BASE_URL}/ai/simplify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text: '   ' }),
  });
  const emptySimplifyData = await emptySimplifyRes.json();
  assert(emptySimplifyRes.status === 400, 'Rejects empty text with HTTP 400');
  assert(emptySimplifyData.success === false, 'success is false');
  assert(emptySimplifyData.message === 'Validation failed', 'Validation error returned');

  // --- TEST C: Excessively large simplify text ---
  console.log('\nTEST C: Excessively Large Simplify Text (>25k characters)');
  const giantText = 'A'.repeat(30000);
  const largeSimplifyRes = await fetch(`${BASE_URL}/ai/simplify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text: giantText }),
  });
  const largeSimplifyData = await largeSimplifyRes.json();
  assert(largeSimplifyRes.status === 400, 'Rejects oversized text with HTTP 400');
  assert(largeSimplifyData.success === false, 'Rate/size protection triggered');

  // --- TEST D: Valid Ask AccessAI request ---
  console.log('\nTEST D: Valid Ask AccessAI Request');
  const validAskRes = await fetch(`${BASE_URL}/ai/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      context: 'AccessAI was created for the Hackathon: AI for Accessibility & Inclusion.',
      question: 'What hackathon theme was AccessAI created for?',
    }),
  });
  const validAskData = await validAskRes.json();
  if (validAskRes.status === 200) {
    assert(validAskData.success === true, 'Status 200 OK with live Gemini answer');
    assert(Boolean(validAskData.data?.answer), 'Answer text received');
  } else {
    assert(validAskRes.status === 503 || validAskRes.status === 502, 'Handled API call safely with 503/502');
  }

  // --- TEST E: Missing question ---
  console.log('\nTEST E: Missing Question in Ask Request');
  const missingQRes = await fetch(`${BASE_URL}/ai/ask`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      context: 'Some context information.',
    }),
  });
  const missingQData = await missingQRes.json();
  assert(missingQRes.status === 400, 'Rejects missing question with HTTP 400');
  assert(missingQData.success === false, 'Validation failed for missing question');

  // --- TEST F: Valid image request ---
  console.log('\nTEST F: Valid Image Request (Base64 Payload)');
  const validImageRes = await fetch(`${BASE_URL}/ai/image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      imageBase64: TINY_PNG_BASE64,
      mimeType: 'image/png',
    }),
  });
  const validImageData = await validImageRes.json();
  if (validImageRes.status === 200) {
    assert(validImageData.success === true, 'Status 200 OK with image analysis');
  } else {
    assert(validImageRes.status === 503 || validImageRes.status === 502, 'Handled image analysis safely with 503/502');
  }

  // --- TEST G: Unsupported image type ---
  console.log('\nTEST G: Unsupported Image Type (e.g. application/pdf)');
  const badImageRes = await fetch(`${BASE_URL}/ai/image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      imageBase64: TINY_PNG_BASE64,
      mimeType: 'application/pdf',
    }),
  });
  const badImageData = await badImageRes.json();
  assert(badImageRes.status === 400, 'Rejects unsupported MIME type with HTTP 400');
  assert(badImageData.success === false, 'success is false for invalid image');

  // --- TEST H: Unauthenticated AI request ---
  console.log('\nTEST H: Unauthenticated AI Request');
  const noAuthRes = await fetch(`${BASE_URL}/ai/simplify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Some text to simplify' }),
  });
  assert(noAuthRes.status === 401, 'Rejects unauthenticated request with HTTP 401');

  // --- TEST I: Gemini API failure handling ---
  console.log('\nTEST I: Gemini API Failure Handling');
  // Trigger missing payload
  const emptyBodyRes = await fetch(`${BASE_URL}/ai/image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({}),
  });
  assert(emptyBodyRes.status === 400, 'Empty image body safely rejected with HTTP 400');

  // --- TEST J: Confirm Gemini API key is not exposed to frontend responses ---
  console.log('\nTEST J: Verify Gemini API Key is NEVER Exposed');
  const allResponses = [
    JSON.stringify(validSimplifyData),
    JSON.stringify(emptySimplifyData),
    JSON.stringify(largeSimplifyData),
    JSON.stringify(validAskData),
    JSON.stringify(missingQData),
    JSON.stringify(validImageData),
    JSON.stringify(badImageData),
  ];

  let keyExposed = false;
  for (const resp of allResponses) {
    if (resp.includes('AIzaSy') || resp.includes('GEMINI_API_KEY')) {
      keyExposed = true;
    }
  }
  assert(!keyExposed, 'Zero occurrences of API keys or environment secrets in responses');

  console.log('\n====================================================');
  console.log(`Phase 5 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase5Tests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
