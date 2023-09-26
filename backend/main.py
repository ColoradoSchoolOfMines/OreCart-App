from fastapi import FastAPI

app = FastAPI()



@app.get("/")
def root():
    return "tomtom"

@app.get("/apple")
def root():
    return 5