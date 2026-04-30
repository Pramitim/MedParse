from parser import parse_note
from database import init_db, insert_record

# initialize database
init_db()

# read file
with open("record.txt", "r") as f:
    lines = f.readlines()

results = []

for line in lines:
    line = line.strip()

    if not line:
        continue

    # parse note
    data = parse_note(line)

    # store in database
    insert_record(data)

    results.append(data)

# output
print("\nDONE PROCESSING\n")

for r in results:
    print(r)