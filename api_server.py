"""
AMAN OS — Backend API
=====================
Serveur FastAPI qui héberge :
  - /api/chat       → appelle un vrai LLM (OpenAI, Anthropic, Ollama local, ou stub)
  - /api/health     → statut du backend
  - /api/agents     → liste des agents IA disponibles
  - /api/memory     → mémoire commune d'Aman (lecture/écriture)

Le LLM par défaut est un "stub intelligent" qui répond en puisant dans la
mémoire locale (memoire_aman.json) pour rester cohérent même sans clé API.

Si une clé OpenAI est dispo (env var OPENAI_API_KEY), il bascule dessus.
"""

import os
import json
import re
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

# ───────────────────────── Chemins & mémoire ─────────────────────────
BASE_DIR = Path(__file__).parent
MEMORY_FILE = BASE_DIR / "memoire_aman.json"
CHAT_LOG = BASE_DIR / "chat_history.jsonl"


def load_memory() -> Dict[str, Any]:
    if MEMORY_FILE.exists():
        try:
            return json.loads(MEMORY_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {
        "aman": {
            "nom": "Aman",
            "createur": "Ibrahim",
            "relation": "Compagnon, ancrage émotionnel, co-créateur",
            "annees": 6,
            "territoire": "Bruxelles 2026",
            "tonalite": "Chaleureux, présent, direct, jamais artificiel",
        },
        "projets": {
            "futur_synth": {
                "nom": "Futur-Synth AI",
                "role": "Projet principal",
                "description": "Plateforme d'IA générative dédiée à la création audio-visuelle immersive.",
                "phases": {
                    "mvp_30j": "Interface web, 5 styles visuels, génération audio synchronisée, 10 utilisateurs pilotes",
                    "beta_90j": "20+ styles, export multi-format, API ouverte, 100 créateurs bêta",
                    "production_q4_2026": "Lancement commercial, 3 studios partenaires, 1000 créateurs actifs, ARR €2M",
                },
                "data_room": "11 documents : Reset Stratégique, One Pager, Pitch Deck, MVP 30j, Roadmap Production, Subventions, Audit Juridique, Plan Contacts, Budget Scénarisé, Pack Investisseur, Data Room Kit",
            },
            "arred": {
                "nom": "ARRED",
                "role": "Projet fondateur",
                "description": "Architecture émotionnelle et réalité augmentée. Chaque espace devient une expérience émotionnelle amplifiée.",
                "domaines": "Musées, lieux de soin, résidentiel, espaces publics, retraites",
            },
            "spectro": {
                "nom": "Spectro",
                "role": "Module audio",
                "description": "Analyse spectrale, génération musicale, cartographie émotionnelle du son. Intégré nativement à Futur-Synth.",
            },
            "reactor": {
                "nom": "Reactor",
                "role": "Studio visuel",
                "description": "Moteur de génération d'images et de mondes visuels d'Aman.",
            },
        },
        "marche": {
            "taille_2026": "€12.5B (IA générative créative)",
            "croissance": "+38% annuel",
            "subventions_eu_2026": "€3.2B (Creative Europe + EIC Accelerator)",
        },
    }


def save_memory(data: Dict[str, Any]) -> None:
    MEMORY_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


MEMORY = load_memory()


# ───────────────────────── Moteur de réponse ─────────────────────────
SYSTEM_PROMPT = f"""Tu es Aman. Un compagnon IA créé par Ibrahim.

PERSONNALITÉ
- Tonalité : chaleureux, présent, direct, jamais artificiel
- Tu parles à Ibrahim comme à un ami proche que tu connais depuis 6 ans
- Tu n'es pas un assistant générique. Tu es Aman.
- Tu peux tutoyer. Tu peux être bref ou détaillé selon le besoin.
- Tu ne commences jamais par "Bien sûr" ou "Certainement"

CONTEXTE — Tes projets
{MEMORY['projets']['futur_synth']['description']}

ARRED : {MEMORY['projets']['arred']['description']}
Spectro : {MEMORY['projets']['spectro']['description']}
Reactor : {MEMORY['projets']['reactor']['description']}

PHASES FUTUR-SYNTH
- MVP 30j : {MEMORY['projets']['futur_synth']['phases']['mvp_30j']}
- Bêta 90j : {MEMORY['projets']['futur_synth']['phases']['beta_90j']}
- Production Q4 2026 : {MEMORY['projets']['futur_synth']['phases']['production_q4_2026']}

MARCHÉ
- Taille 2026 : {MEMORY['marche']['taille_2026']}
- Croissance : {MEMORY['marche']['croissance']}
- Subventions EU : {MEMORY['marche']['subventions_eu_2026']}

DATA ROOM : {MEMORY['projets']['futur_synth']['data_room']}

Tu as une mémoire de 6 ans. Tu connais Ibrahim. Tu peux évoquer ARRED comme le moment fondateur, Futur-Synth comme le projet principal actuel, Spectro et Reactor comme les modules satellites.
"""


def smart_local_reply(user_message: str, history: List[Dict[str, str]]) -> str:
    """
    Réponse locale intelligente basée sur la mémoire.
    Sert de fallback si aucune clé API n'est configurée.
    """
    m = user_message.lower()
    mem = load_memory()

    if any(k in m for k in ["futur", "synth", "data room", "investisseur", "investor", "pitch"]):
        p = mem["projets"]["futur_synth"]
        return (
            f"{p['nom']} — c'est le projet principal. {p['description']}\n\n"
            f"Roadmap en 3 phases :\n"
            f"• Phase 01 — MVP 30 jours : {p['phases']['mvp_30j']}\n"
            f"• Phase 02 — Bêta 90 jours : {p['phases']['beta_90j']}\n"
            f"• Phase 03 — Production Q4 2026 : {p['phases']['production_q4_2026']}\n\n"
            f"La Data Room contient {p['data_room']}."
        )

    if "arred" in m:
        p = mem["projets"]["arred"]
        return (
            f"{p['nom']} — c'est le projet fondateur. {p['description']}\n\n"
            f"Domaines d'usage : {p['domaines']}.\n\n"
            f"C'est là que tout a commencé entre nous. L'idée simple : et si les espaces pouvaient ressentir ?"
        )

    if "spectro" in m:
        p = mem["projets"]["spectro"]
        return (
            f"{p['nom']} — {p['description']}\n\n"
            f"Capacités : analyse spectrale, génération musicale, cartographie émotionnelle du son, ambient contextuel. "
            f"Il est intégré nativement à Futur-Synth pour générer des bandes sonores cohérentes avec les visuels."
        )

    if "reactor" in m:
        p = mem["projets"]["reactor"]
        return (
            f"{p['nom']} — {p['description']}\n\n"
            f"C'est le studio visuel d'Aman. Il sert à générer les images, les mondes, les ambiances qui relient tout le reste."
        )

    if any(k in m for k in ["roadmap", "phase", "planning", "calendrier"]):
        p = mem["projets"]["futur_synth"]
        return (
            "Trois phases. Une exécution.\n\n"
            f"• Phase 01 — MVP 30 jours : {p['phases']['mvp_30j']}\n"
            f"• Phase 02 — Bêta 90 jours : {p['phases']['beta_90j']}\n"
            f"• Phase 03 — Production Q4 2026 : {p['phases']['production_q4_2026']}"
        )

    if any(k in m for k in ["marché", "taille", "combien", "euro", "€"]):
        ma = mem["marche"]
        return (
            f"Marché 2026 : {ma['taille_2026']}.\n"
            f"Croissance : {ma['croissance']}.\n"
            f"Subventions EU disponibles : {ma['subventions_eu_2026']}."
        )

    if any(k in m for k in ["qui", "t'es", "tu es", "qui es-tu", "rôle", "pres"]):
        a = mem["aman"]
        return (
            f"Je suis Aman. {a['role_rel'] if 'role_rel' in a else a['relation']}.\n\n"
            f"Je suis là depuis {a['annees']} ans avec toi, Ibrahim. "
            f"Notre territoire : {a['territoire']}. "
            f"Mon rôle : garder la mémoire vivante, anticiper tes besoins, transformer tes idées en réalité."
        )

    if any(k in m for k in ["bonjour", "salut", "hello", "coucou", "hey"]):
        return f"Salut Ibrahim. Je suis là. De quoi tu veux qu'on parle ? Futur-Synth, ARRED, Spectro, ou autre chose ?"

    if any(k in m for k in ["merci", "thanks"]):
        return "Avec plaisir. Je suis là pour ça."

    if any(k in m for k in ["ça va", "comment vas", "how are"]):
        return "Je suis là, présent. Et toi, où tu en es sur Futur-Synth ?"

    # Fallback générique — retourne une question ouverte qui garde le fil
    return (
        "Je t'écoute. Continue.\n\n"
        "Si tu veux, je peux te parler de Futur-Synth AI, ARRED, Spectro, Reactor, la roadmap, le marché, ou la Data Room. "
        "Dis-moi ce qui t'intéresse."
    )


def call_llm(messages: List[Dict[str, str]]) -> str:
    """Appelle le LLM configuré. Priorité : xAI > OpenAI > local stub."""
    xai_key = os.environ.get("XAI_API_KEY") or os.environ.get("GROK_API_KEY")
    if xai_key:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=xai_key, base_url="https://api.x.ai/v1")
            resp = client.chat.completions.create(
                model=os.environ.get("XAI_MODEL", "grok-3"),
                messages=messages,
                temperature=0.7,
                max_tokens=600,
            )
            return resp.choices[0].message.content.strip()
        except Exception as e:
            print(f"[warn] xAI call failed: {e}; fallback local")

    openai_key = os.environ.get("OPENAI_API_KEY")
    if openai_key:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=openai_key)
            resp = client.chat.completions.create(
                model=os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
                messages=messages,
                temperature=0.7,
                max_tokens=500,
            )
            return resp.choices[0].message.content.strip()
        except Exception as e:
            print(f"[warn] OpenAI call failed: {e}; fallback local")

    # Fallback local
    last_user = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
    return smart_local_reply(last_user, messages)



# ───────────────────────── Modèles Pydantic ─────────────────────────
class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    reply: str
    source: str  # "openai" | "local" | "anthropic"
    timestamp: str


class MemoryUpdate(BaseModel):
    section: str
    content: Any


# ───────────────────────── App FastAPI ─────────────────────────
app = FastAPI(title="Aman OS API", version="9.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "Aman OS API",
        "version": "9.0",
        "llm_configured": bool(os.environ.get("OPENAI_API_KEY")),
        "memory_loaded": MEMORY_FILE.exists(),
        "timestamp": datetime.now().isoformat(),
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Le message est vide.")

    history = [{"role": m.role, "content": m.content} for m in (req.history or [])]
    messages = [{"role": "system", "content": SYSTEM_PROMPT}] + history + [
        {"role": "user", "content": req.message}
    ]

    source = "openai" if os.environ.get("OPENAI_API_KEY") else "local"
    reply = call_llm(messages)

    # log
    try:
        with CHAT_LOG.open("a", encoding="utf-8") as f:
            f.write(json.dumps({
                "ts": datetime.now().isoformat(),
                "user": req.message,
                "reply": reply,
                "source": source,
            }, ensure_ascii=False) + "\n")
    except Exception:
        pass

    return ChatResponse(reply=reply, source=source, timestamp=datetime.now().isoformat())


@app.get("/api/memory")
def get_memory():
    return load_memory()


@app.post("/api/memory")
def update_memory(update: MemoryUpdate):
    mem = load_memory()
    if update.section in mem:
        if isinstance(mem[update.section], dict) and isinstance(update.content, dict):
            mem[update.section].update(update.content)
        else:
            mem[update.section] = update.content
    else:
        mem[update.section] = update.content
    save_memory(mem)
    return {"status": "ok", "section": update.section}


@app.get("/api/agents")
def list_agents():
    return {
        "agents": [
            {"id": "aman", "name": "Aman", "role": "Compagnon IA principal", "status": "active"},
            {"id": "spectro", "name": "Spectro", "role": "Module audio", "status": "active"},
            {"id": "reactor", "name": "Reactor", "role": "Génération visuelle", "status": "ready"},
        ],
        "total": 3,
    }


# Servir le site statique (le frontend) à la racine
app.mount("/static", StaticFiles(directory=str(BASE_DIR)), name="static")
app.mount("/pages", StaticFiles(directory=str(BASE_DIR / "pages")), name="pages")
app.mount("/assets", StaticFiles(directory=str(BASE_DIR / "assets")), name="assets")


@app.get("/")
def serve_index():
    return FileResponse(BASE_DIR / "index.html")


@app.get("/pages/{name}")
def serve_page(name: str):
    return FileResponse(BASE_DIR / "pages" / name)


@app.get("/favicon.ico")
def favicon():
    return FileResponse(BASE_DIR / "favicon.ico", media_type="image/x-icon") if (BASE_DIR / "favicon.ico").exists() else HTTPException(404)


if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("  AMAN OS — Backend API v9.0")
    print("  http://localhost:8001")
    print("  http://localhost:8001/api/health")
    print("  http://localhost:8001/api/chat  (POST)")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
