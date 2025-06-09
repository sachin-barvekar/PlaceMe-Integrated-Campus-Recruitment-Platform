import json
import base64
import sys
import os
import joblib
from collections import defaultdict
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from preprocess_data import preprocess_job_data

def retrain(raw_data):
    df = preprocess_job_data(raw_data)
    X = df["skills"]
    y = df["role"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    pipeline = Pipeline([
        ("vectorizer", CountVectorizer()),
        ("clf", RandomForestClassifier(n_estimators=100))
    ])
    pipeline.fit(X_train, y_train)

    print("Model trained successfully.")
    print(classification_report(y_test, pipeline.predict(X_test)))

    # Get absolute path to current script's directory
    base_dir = os.path.dirname(os.path.abspath(__file__))

    # Save the model in ml directory
    model_path = os.path.join(base_dir, "job_role_model.pkl")
    joblib.dump(pipeline, model_path)
    print(f"Model saved to {model_path}")

    # Save required skills in ml directory
    role_skills = defaultdict(set)
    for item in raw_data:
        for skill in item["skills"]:
            role_skills[item["role"]].add(skill)

    role_skills_clean = {role: list(skills) for role, skills in role_skills.items()}
    skills_path = os.path.join(base_dir, "required_skills.json")
    with open(skills_path, "w") as f:
        json.dump(role_skills_clean, f, indent=2)
    print(f"Required skills saved to {skills_path}")

if __name__ == "__main__":
    encoded_data = sys.argv[1]
    decoded_json = base64.b64decode(encoded_data).decode("utf-8")
    parsed_data = json.loads(decoded_json)
    retrain(parsed_data)
