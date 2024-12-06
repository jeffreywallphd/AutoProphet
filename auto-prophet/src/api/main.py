from fastapi import FastAPI
from fastapi.responses import RedirectResponse

app = FastAPI()


@app.get("/stock_charts")
async def read_chart():
    return RedirectResponse(url='http://127.0.0.1:8080/')
        
