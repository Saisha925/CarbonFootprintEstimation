from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()
mdl = joblib.load("api/model.pkl")

class Fts(BaseModel):
    nrg: float
    tpt: float
    wst: float
    ops: float

@app.post("/api/predict")
def pred(req: Fts):
    X = np.array([[req.nrg, req.tpt, req.wst, req.ops]])
    y = mdl.predict(X)
    return {"co2": float(y[0]), "conf": 0.94}