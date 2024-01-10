from dotenv import load_dotenv
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os

load_dotenv()

FORWARD_URL = os.environ["MTLS_FORWARD_URL"]
if FORWARD_URL is None:
    raise ValueError("MTLS_FORWARD_URL must be set")

FORWARD_KEY = os.environ["MTLS_FORWARD_KEY"]
if FORWARD_KEY is None:
    raise ValueError("MTLS_FORWARD_KEY must be set")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def forward_request(request: Request, call_next):
    async with httpx.AsyncClient() as client:
        headers = dict(request.headers)
        headers["X-mTLS-Forward-Key"] = FORWARD_KEY

        # Forward the request to the other server
        response = await client.request(
            method=request.method,
            url=f"{FORWARD_URL}{request.url.path}",
            headers=headers,
            data=await request.body(),
            follow_redirects=True
        )

        # Get the response from the other server
        return Response(content=response.content, status_code=response.status_code)
