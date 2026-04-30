MEDPARSE: Python based AI Powered backend system that processes a .txt file of clinical notes and stores structured data into relational database.


Pipline: raw medical note -> data extraction using GEMINI LLM -> store in SQLite Database 

------------------------------------------------------------------------------------------------

STEP 1 raw medical note(.txt) contains:
- name
- age
- gender
- date
- symptoms
- prescription 
- dosage 

ex. "John Doe, 45 y/o, chest pain, prescribed 5mg Amlodipine"
Note: there can be multiple patient notes in a .txt file 


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


Relationship between 2 tables:
- One patient can have multiple visits
- visits.patient_id links to patients.patient_id



