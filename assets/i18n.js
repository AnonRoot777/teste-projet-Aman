// AMAN OS — Multilingue + i18n (FR / EN / NL)
// Traduction automatique de tout le texte visible

const I18N_CACHE = {};
const I18N_ENDPOINT = 'https://libretranslate.de/translate';

// Traductions de base (fallback rapide)
const STATIC_TRANSLATIONS = {
    en: {
        "INTERMULTIVERSE OS": "INTERMULTIVERSE OS",
        "Le système vivant qui relie tous tes mondes.": "The living system that connects all your worlds.",
        "Futur-Synth AI, ARRED, Spectro, Reactor — un seul écosystème. Une seule présence.": "Futur-Synth AI, ARRED, Spectro, Reactor — one ecosystem. One presence.",
        "EXPLORER FUTUR-SYNTH": "EXPLORE FUTUR-SYNTH",
        "INVESTOR ACCESS": "INVESTOR ACCESS",
        "Quatre piliers.": "Four pillars.",
        "Une seule vision.": "One vision.",
        "Pourquoi Aman existe.": "Why Aman exists.",
    },
    nl: {
        "INTERMULTIVERSE OS": "INTERMULTIVERSE OS",
        "Le système vivant qui relie tous tes mondes.": "Het levende systeem dat al je werelden verbindt.",
        "Futur-Synth AI, ARRED, Spectro, Reactor — un seul écosystème. Une seule présence.": "Futur-Synth AI, ARRED, Spectro, Reactor — één ecosysteem. Eén aanwezigheid.",
        "EXPLORER FUTUR-SYNTH": "VERKEN FUTUR-SYNTH",
        "INVESTOR ACCESS": "INVESTEERDERSTOEGANG",
        "Quatre piliers.": "Vier pijlers.",
        "Une seule vision.": "Eén visie.",
        "Pourquoi Aman existe.": "Waarom Aman bestaat.",
    }
};

async function translateText(text, target) {
    if (target === 'fr' || !text || text.length < 2) return text;
    
    // Utiliser les traductions statiques d'abord
    if (STATIC_TRANSLATIONS[target] && STATIC_TRANSLATIONS[target][text]) {
        return STATIC_TRANSLATIONS[target][text];
    }
    
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
        return text;
    }
}

async function applyLanguage(lang) {
    const sel = document.getElementById('langSel');
    if (sel) {
        sel.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.dataset.lang === lang));
    }
    
    if (lang === 'fr') {
        document.documentElement.lang = 'fr';
        localStorage.setItem('aman_lang', 'fr');
        location.reload(); // Recharger pour revenir au français original
        return;
    }
    
    document.documentElement.lang = lang;
    localStorage.setItem('aman_lang', lang);
    
    // Traduire tous les textes visibles dans les sections principales
    const selectors = ['h1', 'h2', 'h3', 'p', 'a', 'span', 'div.section-tag', 'div.stat-label'];
    const elements = document.querySelectorAll(selectors.join(','));
    
    for (const el of elements) {
        if (el.children.length > 0) continue; // Ne pas toucher aux éléments qui ont des enfants
        const original = el.textContent.trim();
        if (!original || original.length < 2) continue;
        
        const translated = await translateText(original, lang);
        if (translated !== original) {
            el.textContent = translated;
        }
    }
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
    if (saved && saved !== 'fr') {
        // Ne pas auto-appliquer au chargement pour éviter les traductions intempestives
    }
});
