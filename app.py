from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Aman local")

class ChatIn(BaseModel):
    message: str

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat")
def chat(inp: ChatIn):
    return {"reply": f"Aman répond : {inp.message}"}
