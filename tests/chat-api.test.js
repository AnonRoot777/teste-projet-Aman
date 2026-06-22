const assert = require('assert');
const chatApi = require('../api/chat.js');

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

async function callHandler(body, env = {}, fetchImpl = null) {
  const oldEnv = { ...process.env };
  const oldFetch = global.fetch;
  process.env = { ...oldEnv, ...env };
  if (fetchImpl) global.fetch = fetchImpl;
  try {
    const req = { method: 'POST', body };
    const res = makeRes();
    await chatApi(req, res);
    return res;
  } finally {
    process.env = oldEnv;
    global.fetch = oldFetch;
  }
}

async function testFallbackWithoutApiKey() {
  const res = await callHandler({ message: 'Explique librement où en est Aman OS' }, {
    OPENAI_API_KEY: '', XAI_API_KEY: '', GROK_API_KEY: '', OPENROUTER_API_KEY: '', ANTHROPIC_API_KEY: ''
  });
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.llm, false);
  assert.strictEqual(res.body.source, 'fallback-local-aman');
  assert.match(res.body.reply, /Aman|Futur-Synth|moteur|Data Room/i);
}

async function testOpenAiProviderUsesRealChatCompletion() {
  let called = false;
  const res = await callHandler(
    { message: 'Réponds librement', history: [{ role: 'user', content: 'contexte' }] },
    { OPENAI_API_KEY: 'test-key', OPENAI_MODEL: 'gpt-test', XAI_API_KEY: '', OPENROUTER_API_KEY: '', ANTHROPIC_API_KEY: '' },
    async (url, options) => {
      called = true;
      assert.strictEqual(url, 'https://api.openai.com/v1/chat/completions');
      assert.strictEqual(options.method, 'POST');
      assert.strictEqual(options.headers.Authorization, 'Bearer test-key');
      const payload = JSON.parse(options.body);
      assert.strictEqual(payload.model, 'gpt-test');
      assert(payload.messages.some(m => m.role === 'system' && /Aman OS/.test(m.content)));
      assert(payload.messages.some(m => m.role === 'user' && m.content === 'Réponds librement'));
      return { ok: true, json: async () => ({ choices: [{ message: { content: 'Réponse IA réelle simulée.' } }] }) };
    }
  );
  assert(called, 'fetch should be called for configured provider');
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.llm, true);
  assert.strictEqual(res.body.source, 'openai');
  assert.strictEqual(res.body.reply, 'Réponse IA réelle simulée.');
}

async function testProviderFailureFallsBackCleanly() {
  const res = await callHandler(
    { message: 'Un sujet hors sections prédéfinies' },
    { XAI_API_KEY: 'xai-test', OPENAI_API_KEY: '', OPENROUTER_API_KEY: '', ANTHROPIC_API_KEY: '' },
    async () => ({ ok: false, status: 401, text: async () => 'unauthorized' })
  );
  assert.strictEqual(res.statusCode, 200);
  assert.strictEqual(res.body.llm, false);
  assert.strictEqual(res.body.source, 'fallback-after-xai');
  assert.match(res.body.warning, /xai/i);
  assert.match(res.body.reply, /Aman|Futur-Synth|projet/i);
}

(async () => {
  await testFallbackWithoutApiKey();
  await testOpenAiProviderUsesRealChatCompletion();
  await testProviderFailureFallsBackCleanly();
  console.log('chat-api.test.js OK');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
