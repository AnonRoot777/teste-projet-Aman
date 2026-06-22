const assert = require('assert');
const healthApi = require('../api/health.js');

function makeRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    end() { this.ended = true; return this; },
  };
}

async function call(env = {}) {
  const oldEnv = { ...process.env };
  process.env = { ...oldEnv, ...env };
  try {
    const req = { method: 'GET' };
    const res = makeRes();
    await healthApi(req, res);
    return res;
  } finally {
    process.env = oldEnv;
  }
}

(async () => {
  let res = await call({ OPENAI_API_KEY: '', XAI_API_KEY: '', OPENROUTER_API_KEY: '', ANTHROPIC_API_KEY: '' });
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.llm_configured, false);
  assert.strictEqual(res.body.active_provider, null);

  res = await call({ OPENROUTER_API_KEY: 'test', OPENROUTER_MODEL: 'nous/test-model', OPENAI_API_KEY: '', XAI_API_KEY: '', ANTHROPIC_API_KEY: '' });
  assert.strictEqual(res.body.llm_configured, true);
  assert.strictEqual(res.body.active_provider, 'openrouter');
  assert.strictEqual(res.body.active_model, 'nous/test-model');
  console.log('health-api.test.js OK');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
