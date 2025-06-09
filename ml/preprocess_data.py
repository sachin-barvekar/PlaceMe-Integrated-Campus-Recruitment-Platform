import pandas as pd

def preprocess_job_data(raw_data):
    data = []
    for item in raw_data:
        skills_str = " ".join(item["skills"])
        data.append({"role": item["role"], "skills": skills_str})
    return pd.DataFrame(data)
