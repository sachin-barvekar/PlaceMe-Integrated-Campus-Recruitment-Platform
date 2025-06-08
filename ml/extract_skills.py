import sys
import json
import fitz
import re

import os

base_dir = os.path.dirname(os.path.abspath(__file__))
skills_file = os.path.join(base_dir, "required_skills.json")

with open(skills_file) as f:
    skills_map = json.load(f)

all_skills = set(skill.lower() for skills in skills_map.values() for skill in skills)

def extract_text_from_pdf(path):
    doc = fitz.open(path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def extract_skills(text):
    words = re.findall(r'\b\w[\w.+#-]*\b', text.lower())
    return list(set(words) & all_skills)

if __name__ == "__main__":
    resume_path = sys.argv[1]
    text = extract_text_from_pdf(resume_path)
    skills = extract_skills(text)
    print(json.dumps({"skills": skills}))
