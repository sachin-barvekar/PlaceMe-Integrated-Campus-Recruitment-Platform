import sys
import json
import csv

def parse_csv(file_path):
    role_skills = {}
    try:
        with open(file_path, encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                role = row.get("role")
                skills = row.get("skills")
                if role and skills:
                    skill_list = [s.strip().lower() for s in skills.split(",")]
                    role = role.strip()
                    if role in role_skills:
                        role_skills[role].extend(skill_list)
                    else:
                        role_skills[role] = skill_list
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        exit(1)

    return role_skills

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "CSV path missing"}), file=sys.stderr)
        exit(1)

    file_path = sys.argv[1]
    parsed_roles = parse_csv(file_path)
    output = [{"role": k, "skills": v} for k, v in parsed_roles.items()]
    print(json.dumps(output))
