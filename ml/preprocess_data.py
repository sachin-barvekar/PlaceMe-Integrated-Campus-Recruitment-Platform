import pandas as pd

def preprocess_job_data(raw_data):
    """
    Convert list of dicts to a DataFrame for model training
    """
    processed = []
    for item in raw_data:
        skills_str = " ".join(item["skills"])
        processed.append({
            "skills": skills_str,
            "role": item["role"]
        })
    return pd.DataFrame(processed)
