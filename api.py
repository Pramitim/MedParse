from fastapi import FastAPI
from pydantic import BaseModel
from redis import Redis
from rq import Queue
from database import init_db

init_db()

# connect to redis
redis_conn = Redis(host="localhost", port=6379)

# create queue
q = Queue("medical_notes", connection=redis_conn)

# create fastapi app
app = FastAPI()


# request body schema
class NoteRequest(BaseModel):
    note: str


@app.get("/")
def home():
    return {"message": "Medical Parser API Running"}


@app.post("/notes")
def submit_note(data: NoteRequest):

    # add note processing job to queue
    job = q.enqueue(
        "worker.process_note",
        data.note
    )

    return {
        "message": "Note queued successfully",
        "job_id": job.id,
        "status": "queued"
    }