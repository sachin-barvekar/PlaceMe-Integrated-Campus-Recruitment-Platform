import joblib
import json
from collections import defaultdict
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

from fetch_job_data import fetch_job_data
from preprocess_data import preprocess_job_data

def retrain():
    print("🔄 Fetching new job-role data...")
    raw_data = fetch_job_data()
    df = preprocess_job_data(raw_data)

    X = df["skills"]
    y = df["role"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    pipeline = Pipeline([
        ("vectorizer", CountVectorizer()),
        ("clf", RandomForestClassifier(n_estimators=100))
    ])

    pipeline.fit(X_train, y_train)

    print("✅ Model trained.")
    print("📊 Evaluation report:")
    print(classification_report(y_test, pipeline.predict(X_test)))

    # Save model
    joblib.dump(pipeline, "job_role_model.pkl")
    print("💾 Model saved to job_role_model.pkl")

    # Build required_skills.json
    role_skills = defaultdict(set)
    for item in raw_data:
        for skill in item["skills"]:
            role_skills[item["role"]].add(skill)

    # Convert to list and save
    role_skills_clean = {role: list(skills) for role, skills in role_skills.items()}
    with open("required_skills.json", "w") as f:
        json.dump(role_skills_clean, f, indent=2)

    print("💾 Required skills saved to required_skills.json")

if __name__ == "__main__":
    retrain()
