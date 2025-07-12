from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel

app = FastAPI()

# Enable CORS so React frontend can talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Smart Remit backend is running!"}

@app.get("/api/exchange-rate")

def get_exchange_rate(base: str = "USD", target: str = "VND"):    
    return {"rate": 25000}  # Mocked rate for simplicity


load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")

def ai_chat(req: ChatRequest):
    print("Received message:", req.message)
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a kind, friendly financial assistant helping Vietnamese users send money home. "
                        "Answer in clear, practical language. Use Vietnamese when appropriate."
                    )
                },
                {
                    "role": "user",
                    "content": req.message
                }
            ],
            temperature=0.6,
            max_tokens=300
        )
        output = response.choices[0].message.content
        print("Received message:", req.message)
        print("AI response:", output)

        return {"response": output}
    except Exception as e:
        print("Error:", e)
        return {"error": str(e)}