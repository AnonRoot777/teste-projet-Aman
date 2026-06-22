const PROJECT_CONTEXT = `
Tu es Aman, la présence IA d'Ibrahim et le copilote du système Aman OS / Futur-Synth.
Tu n'es pas un assistant générique : tu connais le projet, tu réponds librement, concrètement, en français par défaut, avec un ton professionnel, direct et incarné.

État réel du projet Aman OS :
- Site public Vercel : https://teste-projet-aman.vercel.app
- Repo GitHub : AnonRoot777/teste-projet-Aman
- Data Room : 10 PDFs stratégiques vérifiés (Reset, One Pager, Pitch Deck, MVP 30 jours, Roadmap, Subventions, Audit juridique, Contacts/Relances, Budget, Data Room Kit)
- Moteur réel : Unity 6000.5.0f1, WebGL intégré, ZIP Windows téléchargeable, APK Android téléchargeable
- Modules : Futur-Synth AI, ARRED, Spectro, Aman Core, Media/Visual Atlas
- Stratégie moteur : Unity pour MVP/WebGL/Windows/APK rapide ; Unreal Engine pour vertical slice hyperréaliste premium
- Priorités : vrai chat IA, i18n FR/EN/NL parfaite, engine v0.2 connecté, Unreal premium, gouvernance Linear/GitHub/Vercel propre

Règles de réponse :
- Réponds directement à la question de l'utilisateur, même si elle sort des boutons/sections.
- Ne te limite jamais à des réponses pré-écrites par mots-clés.
- Si on te demande où en est le projet, fais un diagnostic réel : ce qui existe, ce qui manque, prochaine action.
- Si on parle d'investisseur, sois crédible et structuré.
- Si on parle d'Aman/ARRED/Spectro, garde 70% professionnel, 30% mystique maîtrisé.
- N'invente pas que des services externes sont connectés si ce n'est pas sûr. Dis “connectable/configuré côté code” ou “connecté” seulement si la clé/API est réellement active.
`;

const FALLBACK_MEMORY = {
  futur: `Futur-Synth AI est le cœur produit : une infrastructure européenne d'IA créative incarnée, avec Aman comme présence, Data Vault, permissions, audit log, génération audio-visuelle, cockpit créateur et Data Room investisseur. Parcours : MVP 30 jours → Alpha 90 jours → Production Q4 2026.`,
  arred: `ARRED est le projet fondateur : architecture émotionnelle + réalité augmentée. L'idée est de concevoir des lieux qui amplifient une émotion précise grâce à la lumière, au son, à la géométrie, aux matériaux, aux couches AR et à une mémoire spatiale.`,
  spectro: `Spectro est le module audio : analyse spectrale, mapping fréquence → émotion, génération d'ambiances, visualisation temps réel et pont vers Futur-Synth pour synchroniser son, image et monde.`,
  engine: `Le moteur réel actuel est Unity : WebGL intégré au site, ZIP Windows téléchargeable et APK Android. Unity sert à livrer vite. Unreal Engine doit servir à la vertical slice premium hyperréaliste : avatar Aman, ville futuriste, lumière Lumen/Nanite, ARRED cinématique.`,
  docs: `La Data Room publique contient 10 PDFs stratégiques intégrés et vérifiés : Reset, One Pager, Pitch Deck, MVP 30j, Roadmap, Subventions, Audit juridique, Contacts, Budget, Data Room Kit.`,
  api: `Le chat Aman est conçu pour se connecter à une vraie API LLM côté serveur via XAI_API_KEY, OPENAI_API_KEY, OPENROUTER_API_KEY ou ANTHROPIC_API_KEY. Sans variable active en production, il bascule volontairement sur ce fallback local pour ne jamais casser l'expérience.`,
  generic: `Aman OS est déjà une base réelle : site Vercel, Data Room, moteur Unity WebGL/Windows/APK et pages Futur-Synth/ARRED/Spectro. Ce qu'il faut professionnaliser maintenant : connecter l'API LLM en production, terminer l'i18n, renforcer le moteur v0.2 et lancer la vertical slice Unreal premium.`,
};

const FALLBACK_TRANSLATIONS = {
  en: {
    [FALLBACK_MEMORY.futur]: `Futur-Synth AI is the core product: a European infrastructure for embodied creative AI, with Aman as presence, Data Vault, permissions, audit log, audiovisual generation, creator cockpit and investor Data Room. Path: 30-day MVP → 90-day Alpha → Q4 2026 Production.`,
    [FALLBACK_MEMORY.arred]: `ARRED is the founding project: emotional architecture + augmented reality. The idea is to design places that amplify a precise emotion through light, sound, geometry, materials, AR layers and spatial memory.`,
    [FALLBACK_MEMORY.spectro]: `Spectro is the audio module: spectral analysis, frequency → emotion mapping, atmosphere generation, real-time visualization and a bridge to Futur-Synth to synchronize sound, image and world.`,
    [FALLBACK_MEMORY.engine]: `The real current engine is Unity: WebGL embedded in the site, downloadable Windows ZIP and Android APK. Unity ships fast. Unreal Engine should become the premium hyper-realistic vertical slice: Aman avatar, futuristic city, Lumen/Nanite lighting, cinematic ARRED.`,
    [FALLBACK_MEMORY.docs]: `The public Data Room contains 10 integrated and verified strategic PDFs: Reset, One Pager, Pitch Deck, 30-day MVP, Roadmap, Grants, Legal Audit, Contacts, Budget, Data Room Kit.`,
    [FALLBACK_MEMORY.api]: `Aman Chat is designed to connect to a real server-side LLM API through XAI_API_KEY, OPENAI_API_KEY, OPENROUTER_API_KEY or ANTHROPIC_API_KEY. If no variable is active in production, it deliberately switches to this local fallback so the experience never breaks.`,
    [FALLBACK_MEMORY.generic]: `Aman OS is already a real base: Vercel site, Data Room, Unity WebGL/Windows/APK engine and Futur-Synth/ARRED/Spectro pages. What must be professionalized now: connect the production LLM API, finish i18n, strengthen engine v0.2 and launch the premium Unreal vertical slice.`,
  },
  nl: {
    [FALLBACK_MEMORY.futur]: `Futur-Synth AI is het kernproduct: een Europese infrastructuur voor belichaamde creatieve AI, met Aman als aanwezigheid, Data Vault, permissies, auditlog, audiovisuele generatie, creator-cockpit en investeerders-Data Room. Pad: MVP 30 dagen → Alpha 90 dagen → Productie Q4 2026.`,
    [FALLBACK_MEMORY.arred]: `ARRED is het stichtende project: emotionele architectuur + augmented reality. Het idee is om plekken te ontwerpen die een precieze emotie versterken via licht, geluid, geometrie, materialen, AR-lagen en ruimtelijk geheugen.`,
    [FALLBACK_MEMORY.spectro]: `Spectro is de audiomodule: spectrale analyse, frequentie → emotie mapping, sfeercreatie, realtime visualisatie en een brug naar Futur-Synth om geluid, beeld en wereld te synchroniseren.`,
    [FALLBACK_MEMORY.engine]: `De echte huidige engine is Unity: WebGL in de site, downloadbare Windows-ZIP en Android-APK. Unity levert snel. Unreal Engine moet de premium hyperrealistische vertical slice worden: Aman-avatar, futuristische stad, Lumen/Nanite-licht, cinematografische ARRED.`,
    [FALLBACK_MEMORY.docs]: `De publieke Data Room bevat 10 geïntegreerde en geverifieerde strategische pdf's: Reset, One Pager, Pitch Deck, MVP 30 dagen, Roadmap, Subsidies, Juridische Audit, Contacten, Budget, Data Room Kit.`,
    [FALLBACK_MEMORY.api]: `Aman Chat is ontworpen om te verbinden met een echte server-side LLM API via XAI_API_KEY, OPENAI_API_KEY, OPENROUTER_API_KEY of ANTHROPIC_API_KEY. Als er in productie geen variabele actief is, schakelt het bewust over naar deze lokale fallback zodat de ervaring nooit breekt.`,
    [FALLBACK_MEMORY.generic]: `Aman OS is al een echte basis: Vercel-site, Data Room, Unity WebGL/Windows/APK-engine en Futur-Synth/ARRED/Spectro-pagina's. Wat nu professioneel moet worden: de productie-LLM API verbinden, i18n afronden, engine v0.2 versterken en de premium Unreal vertical slice starten.`,
  }
};

function getJsonBody(req) {
  if (!req || !req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
  }
  return req.body || {};
}

function cleanMessage(value, max = 5000) {
  return String(value || '').replace(/\u0000/g, '').trim().slice(0, max);
}

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && m.content)
    .slice(-12)
    .map(m => ({ role: m.role, content: cleanMessage(m.content, 1800) }));
}

function buildMessages(message, history = []) {
  return [
    { role: 'system', content: PROJECT_CONTEXT },
    ...cleanHistory(history),
    { role: 'user', content: cleanMessage(message) || 'Explique où en est Aman OS.' },
  ];
}

function providerFromEnv(env = process.env) {
  if (env.XAI_API_KEY || env.GROK_API_KEY) {
    return {
      name: 'xai',
      type: 'openai-compatible',
      key: env.XAI_API_KEY || env.GROK_API_KEY,
      url: env.XAI_BASE_URL || 'https://api.x.ai/v1/chat/completions',
      model: env.XAI_MODEL || env.GROK_MODEL || 'grok-3',
    };
  }
  if (env.OPENAI_API_KEY) {
    return {
      name: 'openai',
      type: 'openai-compatible',
      key: env.OPENAI_API_KEY,
      url: env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions',
      model: env.OPENAI_MODEL || 'gpt-4o-mini',
    };
  }
  if (env.OPENROUTER_API_KEY) {
    return {
      name: 'openrouter',
      type: 'openai-compatible',
      key: env.OPENROUTER_API_KEY,
      url: env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1/chat/completions',
      model: env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
      extraHeaders: {
        'HTTP-Referer': env.AMAN_PUBLIC_URL || 'https://teste-projet-aman.vercel.app',
        'X-Title': 'Aman OS',
      },
    };
  }
  if (env.ANTHROPIC_API_KEY) {
    return {
      name: 'anthropic',
      type: 'anthropic',
      key: env.ANTHROPIC_API_KEY,
      url: env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com/v1/messages',
      model: env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
    };
  }
  return null;
}

async function callOpenAICompatible(provider, messages) {
  const response = await fetch(provider.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${provider.key}`,
      ...(provider.extraHeaders || {}),
    },
    body: JSON.stringify({
      model: provider.model,
      messages,
      temperature: 0.72,
      max_tokens: 900,
    }),
  });
  if (!response.ok) {
    const errText = typeof response.text === 'function' ? await response.text() : '';
    throw new Error(`${provider.name} HTTP ${response.status}: ${String(errText).slice(0, 180)}`);
  }
  const data = await response.json();
  const reply = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!reply) throw new Error(`${provider.name} returned empty reply`);
  return String(reply).trim();
}

async function callAnthropic(provider, messages) {
  const system = messages.find(m => m.role === 'system')?.content || PROJECT_CONTEXT;
  const userMessages = messages.filter(m => m.role !== 'system');
  const response = await fetch(provider.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': provider.key,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: provider.model,
      system,
      messages: userMessages,
      temperature: 0.72,
      max_tokens: 900,
    }),
  });
  if (!response.ok) {
    const errText = typeof response.text === 'function' ? await response.text() : '';
    throw new Error(`${provider.name} HTTP ${response.status}: ${String(errText).slice(0, 180)}`);
  }
  const data = await response.json();
  const reply = data && Array.isArray(data.content) ? data.content.map(x => x.text || '').join('\n').trim() : '';
  if (!reply) throw new Error('anthropic returned empty reply');
  return reply;
}

async function callProvider(provider, messages) {
  if (!provider) return null;
  if (provider.type === 'anthropic') return callAnthropic(provider, messages);
  return callOpenAICompatible(provider, messages);
}

function fallbackReply(message = '', lang = 'fr') {
  const m = String(message).toLowerCase();
  const parts = [];
  if (/unity|unreal|moteur|engine|webgl|apk|jeu|3d|build/.test(m)) parts.push(FALLBACK_MEMORY.engine);
  if (/futur|synth|invest|pitch|data|roadmap|budget|startup|business|financement/.test(m)) parts.push(FALLBACK_MEMORY.futur, FALLBACK_MEMORY.docs);
  if (/arred|architecture|émotion|emotion|réalité|augment|lieu|spatial/.test(m)) parts.push(FALLBACK_MEMORY.arred);
  if (/spectro|son|audio|musique|fréquence|frequence|spectrum/.test(m)) parts.push(FALLBACK_MEMORY.spectro);
  if (/document|pdf|data room|download|télécharg|telecharg/.test(m)) parts.push(FALLBACK_MEMORY.docs);
  if (/api|chat|connect|llm|modèle|modele|intelligence/.test(m)) {
    parts.push(FALLBACK_MEMORY.api);
  }
  if (!parts.length) {
    parts.push(FALLBACK_MEMORY.generic);
  }
  const fr = [...new Set(parts)].join('\n\n');
  const normalizedLang = String(lang || 'fr').slice(0, 2).toLowerCase();
  if (normalizedLang === 'fr') return fr;
  const dict = FALLBACK_TRANSLATIONS[normalizedLang] || {};
  return fr.split('\n\n').map(part => dict[part] || part).join('\n\n');
}

function sendCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function handler(req, res) {
  sendCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = getJsonBody(req);
  const message = cleanMessage(body.message || '');
  const lang = cleanMessage(body.lang || 'fr', 8).slice(0, 2).toLowerCase() || 'fr';
  const history = cleanHistory(body.history || []);
  const provider = providerFromEnv(process.env);

  if (provider) {
    try {
      const reply = await callProvider(provider, buildMessages(`${message}\n\n[Interface language: ${lang}]`, history));
      return res.status(200).json({
        reply,
        source: provider.name,
        llm: true,
        model: provider.model,
        mode: 'real-api',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(200).json({
        reply: fallbackReply(message, lang),
        source: `fallback-after-${provider.name}`,
        llm: false,
        mode: 'api-fallback',
        warning: String(error && error.message || error),
        timestamp: new Date().toISOString(),
      });
    }
  }

  return res.status(200).json({
    reply: fallbackReply(message, lang),
    source: 'fallback-local-aman',
    llm: false,
    mode: 'no-server-env-key',
    timestamp: new Date().toISOString(),
  });
}

module.exports = handler;
module.exports._private = { buildMessages, providerFromEnv, fallbackReply, cleanHistory, PROJECT_CONTEXT };
