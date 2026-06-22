function providerStatus(env = process.env) {
  const providers = [
    { name: 'xai', configured: Boolean(env.XAI_API_KEY || env.GROK_API_KEY), model: env.XAI_MODEL || env.GROK_MODEL || 'grok-3' },
    { name: 'openai', configured: Boolean(env.OPENAI_API_KEY), model: env.OPENAI_MODEL || 'gpt-4o-mini' },
    { name: 'openrouter', configured: Boolean(env.OPENROUTER_API_KEY), model: env.OPENROUTER_MODEL || 'openai/gpt-4o-mini' },
    { name: 'anthropic', configured: Boolean(env.ANTHROPIC_API_KEY), model: env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest' },
  ];
  const active = providers.find(p => p.configured) || null;
  return { providers, active };
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const status = providerStatus(process.env);
  return res.status(200).json({
    status: 'ok',
    service: 'Aman OS API',
    version: '10.0',
    llm_configured: Boolean(status.active),
    active_provider: status.active ? status.active.name : null,
    active_model: status.active ? status.active.model : null,
    providers: status.providers.map(p => ({ name: p.name, configured: p.configured, model: p.model })),
    endpoints: ['/api/chat', '/api/health'],
    production: 'https://teste-projet-aman.vercel.app',
    timestamp: new Date().toISOString(),
  });
};

module.exports._private = { providerStatus };
