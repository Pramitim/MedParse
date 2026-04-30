from sqlalchemy import create_engine, text

engine = create_engine("sqlite:///med_parse.db")


def init_db():
    with engine.connect() as conn:
        conn.execute(text("""
        CREATE TABLE IF NOT EXISTS patients (
            patient_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            age INTEGER,
            gender TEXT
        )
        """))

        conn.execute(text("""
        CREATE TABLE IF NOT EXISTS visits (
            visit_id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER,
            symptom TEXT,
            medication TEXT,
            dosage TEXT
        )
        """))

        conn.commit()


def insert_record(record: dict):
    with engine.connect() as conn:

        # check if patient exists
        patient = conn.execute(
            text("SELECT patient_id FROM patients WHERE name=:name"),
            {"name": record["name"]}
        ).fetchone()

        if patient:
            patient_id = patient[0]
        else:
            res = conn.execute(
                text("INSERT INTO patients (name, age, gender) VALUES (:name, :age, :gender)"),
                {
                    "name": record["name"],
                    "age": record["age"],
                    "gender": record["gender"]
                }
            )
            conn.commit()
            patient_id = res.lastrowid

        # insert visit
        conn.execute(
            text("""
            INSERT INTO visits (patient_id, symptom, medication, dosage)
            VALUES (:patient_id, :symptom, :medication, :dosage)
            """),
            {
                "patient_id": patient_id,
                "symptom": record["symptom"],
                "medication": record["medication"],
                "dosage": record["dosage"]
            }
        )

        conn.commit()