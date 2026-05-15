import pandas as pd
import json

df = pd.read_excel("../data/knowledge.xlsx")

knowledge = []

for _, row in df.iterrows():

    item = {
        "question": str(row["Question"]).lower(),
        "answer": str(row["Answer"]),
        "category": str(row["Category"])
    }

    knowledge.append(item)

with open("../data/knowledge.json", "w", encoding="utf-8") as f:
    json.dump(knowledge, f, indent=4)

print("knowledge.json created successfully")