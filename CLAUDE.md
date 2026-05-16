# MEDPARSE

Full-stack web application that extracts key information from natural language clinical notes and allows users to search and view patient medical histories

## Pipeline:

Raw medical note upload (React frontend) → API receives file → task enqueued in Redis queue → worker processes request → prompt formatting for Gemini LLM to extract structured patient data (JSON format) → compute data quality score of Gemini JSON response → store structured data in SQLite database → API serves patient queries → retrieve and aggregate patient records → display structured patient history in React UI

## Tech Stack

- Python (FastAPI)
- TypeScript (React)
- SQLite
- Docker
- Redis Queue
- Gemini API (LLM)

## Key Structures

STEP 1 raw medical note(.txt) contains:

- name
- age
- gender
- date
- symptoms
- prescription
- dosage

ex. "John Doe, 45 y/o, chest pain, prescribed 5mg Amlodipine"

STEP 2 data extraction + structure(JSON):

{
"name": "John Doe",
"age": 45,
"symptom": "chest pain",
"medication": "Amlodipine",
"dosage": "5mg"
}

STEP 3: Database design(SQLite):

1. patients table (each row = one patient):

- patient_id (primary key)
- name
- age
- gender

2. visits table (each row = one clinical note)

- visit_id (primary key)
- patient_id (foreign key referencing patients.patient_id)
- date
- symptoms
- medication
- dosage
- data correctness score

Relationship between 2 tables:

- One patient can have multiple visits
- visits.patient_id links to patients.patient_id
