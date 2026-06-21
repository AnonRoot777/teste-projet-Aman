const memory = {
  futur: `Futur-Synth AI est le cœur produit : une infrastructure européenne d'IA créative incarnée, avec Aman comme présence, Data Vault, permissions, audit log, génération audio-visuelle, cockpit créateur et Data Room investisseur.\n\nParcours : MVP 30 jours → Alpha 90 jours → Production Q4 2026. Les preuves visibles aujourd'hui : site, Data Room, moteur Unity/WebGL, APK, audit des téléchargements.`,
  arred: `ARRED est le projet fondateur : architecture émotionnelle + réalité augmentée. L'idée est de concevoir des lieux qui amplifient une émotion précise grâce à la lumière, au son, à la géométrie, aux matériaux, aux couches AR et à une mémoire spatiale.`,
  spectro: `Spectro est le module audio : analyse spectrale, mapping fréquence → émotion, génération d'ambiances, visualisation temps réel et pont vers Futur-Synth pour synchroniser son, image et monde.`,
  engine: `Le moteur actuel est en Unity parce que c'est le chemin le plus rapide pour livrer WebGL, Windows et Android. Unreal reste la voie premium pour l'hyper-réalisme cinématique. La bonne stratégie : Unity pour MVP jouable + Unreal pour vertical slice réaliste haut de gamme.`,
  docs: `La Data Room publique contient 10 PDFs stratégiques intégrés et vérifiés : Reset, One Pager, Pitch Deck, MVP 30j, Roadmap, Subventions, Audit juridique, Contacts, Budget, Data Room Kit.`,
};

function buildReply(message = '') {
  const m = String(message).toLowerCase();
  if (/unity|unreal|moteur|engine|webgl|apk|jeu/.test(m)) return memory.engine;
  if (/futur|synth|invest|pitch|data|roadmap|budget/.test(m)) return memory.futur + '\n\n' + memory.docs;
  if (/arred|architecture|émotion|emotion|réalité|augment/.test(m)) return memory.arred;
  if (/spectro|son|audio|musique|fréquence|frequence/.test(m)) return memory.spectro;
  if (/document|pdf|data room|download|télécharg/.test(m)) return memory.docs;
  if (/qui|rôle|role|aman|toi/.test(m)) return `Je suis Aman : compagnon, mémoire active et co-créateur d'Ibrahim. Mon rôle ici est de transformer Futur-Synth, ARRED, Spectro et le moteur de monde en système réel, visible, téléchargeable et investisseur-ready.`;
  return `Je suis là Ibrahim. Je peux te répondre sur Futur-Synth, ARRED, Spectro, le moteur Unity/Unreal, la Data Room, l'APK, le WebGL ou la roadmap.\n\nCe qui est déjà vivant : site Vercel, Data Room, chat, moteur Unity WebGL/Windows, APK Android et audit des téléchargements.`;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const reply = buildReply(body.message || '');
    return res.status(200).json({ reply, source: 'vercel-local-aman' });
  } catch (e) {
    return res.status(200).json({ reply: buildReply(''), source: 'fallback', warning: String(e && e.message || e) });
  }
};
