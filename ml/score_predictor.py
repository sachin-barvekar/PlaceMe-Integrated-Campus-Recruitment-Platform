import sys
import json
import joblib

def generate_reason_and_suggestions(student_data, required_skills, placement_score, skill_score, cgpa_score):
    reasons = []
    suggestions = []

    # Normalize skills
    student_skills = set(skill.lower() for skill in student_data["skills"])
    required_skills = set(skill.lower() for skill in required_skills)
    missing_skills = required_skills - student_skills
    cgpa = student_data["cgpa"]

    # Reason & suggestion: missing skills
    if missing_skills:
        reasons.append("Some important skills for the predicted role are currently missing.")
        suggestions.append(f"Consider learning: {', '.join(sorted(missing_skills))}.")

    # Reason & suggestion: low CGPA
    if cgpa < 7.5:
        reasons.append(f"Your CGPA is {cgpa}, which is below the recommended minimum of 7.5 for many top placements.")
        suggestions.append("Try to improve your academic performance to enhance placement opportunities.")

    # All skills matched, CGPA decent but score still not 100
    if not missing_skills and cgpa >= 7.5 and placement_score < 100:
        reasons.append("Your profile is strong, but the placement score also considers skill match (70%) and CGPA (30%).")
        suggestions.append("To improve your score further, continue upskilling and stay updated with current industry trends.")

    # Perfect match
    if not reasons:
        reasons.append("Your profile aligns well with the predicted role based on your skills and CGPA.")
        suggestions.append("Keep up the great work!")

    return reasons, suggestions


def main():
    # Load ML model
    model = joblib.load("ml/job_role_model.pkl")

    # Input from stdin
    data = json.loads(sys.stdin.read())
    skills = " ".join(data["skills"])
    cgpa = data["cgpa"]
    input_text = f"{skills} CGPA_{cgpa}"

    # Predict role
    predicted_role = model.predict([input_text])[0]

    # Load required skills for predicted role
    with open("ml/required_skills.json", "r") as f:
        skills_map = json.load(f)

    required_skills = skills_map.get(predicted_role, [])

    # Score calculations
    student_skills = set(skill.lower() for skill in data["skills"])
    required_skills_lower = set(skill.lower() for skill in required_skills)
    matched_skills = student_skills & required_skills_lower

    skill_score = (len(matched_skills) / len(required_skills_lower)) * 70 if required_skills_lower else 0
    cgpa_score = (min(cgpa, 10) / 10) * 30
    placement_score = int(skill_score + cgpa_score)

    # Generate reason & suggestions
    reasons, suggestions = generate_reason_and_suggestions(data, required_skills, placement_score, skill_score, cgpa_score)

    # Final output
    print(json.dumps({
        "role": predicted_role,
        "placementScore": placement_score,
        "reason": reasons,
        "suggestions": suggestions
    }))


if __name__ == "__main__":
    main()
