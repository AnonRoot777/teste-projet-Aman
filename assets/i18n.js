// AMAN OS — Multilingue + i18n
// Utilise l'API gratuite LibreTranslate (instance publique) avec fallback
// sur le texte français si la traduction échoue.

const I18N_CACHE = {};
const I18N_ENDPOINT = 'https://libretranslate.de/translate';

async function translateText(text, target) {
    if (target === 'fr' || !text) return text;
    const cacheKey = `${target}::${text}`;
    if (I18N_CACHE[cacheKey]) return I18N_CACHE[cacheKey];
    try {
        const res = await fetch(I18N_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: text, source: 'fr', target, format: 'text' })
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        I18N_CACHE[cacheKey] = data.translatedText || text;
        return I18N_CACHE[cacheKey];
    } catch (e) {
        return text; // fallback FR
    }
}

async function applyLanguage(lang) {
    if (lang === 'fr') {
        document.documentElement.lang = 'fr';
        localStorage.setItem('aman_lang', 'fr');
        document.querySelectorAll('#langSel a').forEach(a => a.classList.toggle('active', a.dataset.lang === 'fr'));
        return;
    }
    const targets = document.querySelectorAll('[data-i18n]');
    for (const el of targets) {
        const original = el.dataset.i18nOriginal || el.textContent.trim();
        if (!el.dataset.i18nOriginal) el.dataset.i18nOriginal = original;
        const translated = await translateText(original, lang);
        el.textContent = translated;
    }
    document.documentElement.lang = lang;
    localStorage.setItem('aman_lang', lang);
    document.querySelectorAll('#langSel a').forEach(a => a.classList.toggle('active', a.dataset.lang === lang));
}

document.addEventListener('DOMContentLoaded', () => {
    const sel = document.getElementById('langSel');
    if (!sel) return;
    sel.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = a.dataset.lang;
            applyLanguage(lang);
        });
    });
    const saved = localStorage.getItem('aman_lang');
    if (saved && saved !== 'fr') applyLanguage(saved);
});
