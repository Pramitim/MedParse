from redis import Redis
from rq import Worker, Queue
from parser import parse_note
from database import insert_record

# connect to redis
redis_conn = Redis(host="localhost", port=6379)

# processing function
def process_note(note: str):

    print("\nPROCESSING NOTE\n")

    # parse note using Gemini
    parsed_data = parse_note(note)

    # handle parser errors
    if "error" in parsed_data:
        print("Parsing failed:", parsed_data)
        return

    # store in database
    insert_record(parsed_data)

    print("Stored successfully:")
    print(parsed_data)


# create worker
if __name__ == "__main__":

    queue = Queue("medical_notes", connection=redis_conn)
    worker = Worker([queue], connection=redis_conn)

    print("Worker started...")

    worker.work()