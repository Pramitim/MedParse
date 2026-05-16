from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from redis import Redis
from rq import Queue
from database import init_db, engine
from sqlalchemy import text

init_db()

# connect to redis
redis_conn = Redis(host="localhost", port=6379)

# create queue
q = Queue("medical_notes", connection=redis_conn)

# create fastapi app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# request body schema
class NoteRequest(BaseModel):
    note: str


@app.get("/")
def home():
    return {"message": "Medical Parser API Running"}


@app.post("/notes")
def submit_note(data: NoteRequest):
    job = q.enqueue("worker.process_note", data.note)
    return {"message": "Note queued successfully", "job_id": job.id, "status": "queued"}


@app.get("/patients")
def list_patients():
    with engine.connect() as conn:
        rows = conn.execute(text("SELECT patient_id, name, age, gender FROM patients ORDER BY name")).fetchall()
    return [{"patient_id": r[0], "name": r[1], "age": r[2], "gender": r[3]} for r in rows]


@app.get("/patients/search")
def search_patients(name: str = Query(...)):
    with engine.connect() as conn:
        rows = conn.execute(
            text("SELECT patient_id, name, age, gender FROM patients WHERE name LIKE :q ORDER BY name"),
            {"q": f"%{name}%"}
        ).fetchall()
    return [{"patient_id": r[0], "name": r[1], "age": r[2], "gender": r[3]} for r in rows]


@app.get("/patients/{patient_id}")
def get_patient(patient_id: int):
    with engine.connect() as conn:
        patient = conn.execute(
            text("SELECT patient_id, name, age, gender FROM patients WHERE patient_id=:id"),
            {"id": patient_id}
        ).fetchone()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        visits = conn.execute(
            text("SELECT visit_id, symptom, medication, dosage, data_quality_score FROM visits WHERE patient_id=:id ORDER BY visit_id DESC"),
            {"id": patient_id}
        ).fetchall()
    return {
        "patient_id": patient[0],
        "name": patient[1],
        "age": patient[2],
        "gender": patient[3],
        "visits": [
            {"visit_id": v[0], "symptom": v[1], "medication": v[2], "dosage": v[3], "data_quality_score": v[4]}
            for v in visits
        ]
    }