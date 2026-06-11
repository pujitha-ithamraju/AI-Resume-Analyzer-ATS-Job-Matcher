from flask import Flask, request
from flask_cors import CORS
import pdfplumber
import os
import re

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

SKILLS = [
    # Programming
    "Python", "Java", "C", "C++", "C#", "JavaScript",

    # Web Development
    "HTML", "CSS", "React", "Angular", "Node.js",
    "Flask", "Django",

    # Database
    "SQL", "MySQL", "PostgreSQL", "MongoDB",

    # Data Science
    "Machine Learning", "Deep Learning",
    "Pandas", "NumPy", "Scikit-learn",
    "TensorFlow", "PyTorch",

    # BI Tools
    "Excel", "Power BI", "Tableau",

    # Big Data
    "Databricks", "Apache Spark",
    "Hadoop", "Kafka",

    # Cloud
    "AWS", "Azure", "GCP",

    # DevOps
    "Docker", "Kubernetes", "Git", "GitHub"
]


@app.route("/")
def home():
    return "AI Resume Analyzer Backend Running"


@app.route("/upload", methods=["POST"])
def upload():

    file = request.files["resume"]
    job_description = request.form["job_description"]


    # Required Experience


    required_experience = 0

    jd_matches = re.findall(
        r'(\d+)\s*\+?\s*(?:year|years)',
        job_description.lower()
    )

    if jd_matches:
        numbers = [int(x) for x in jd_matches]
        required_experience = min(numbers)


    # Save Resume


    filepath = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    file.save(filepath)


    # Extract Resume Text


    text = ""

    with pdfplumber.open(filepath) as pdf:

        for page in pdf.pages:

            extracted_text = page.extract_text()

            if extracted_text:
                text += extracted_text + "\n"


    # Candidate Experience


    candidate_experience = 0

    # Example:
    # 2-4 years experience

    range_match = re.search(
        r'(\d+)\s*-\s*(\d+)\s*years?',
        text.lower()
    )

    if range_match:

        start_year = int(range_match.group(1))
        end_year = int(range_match.group(2))

        candidate_experience = (
            start_year + end_year
        ) / 2

    else:

        # Example:
        # 2 years
        # 5+ years

        resume_matches = re.findall(
            r'(\d+)\s*\+?\s*(?:year|years)',
            text.lower()
        )

        if resume_matches:

            years = [int(x) for x in resume_matches]

            candidate_experience = max(years)


    # Experience Match


    experience_match = 0

    if required_experience > 0:

        experience_match = (
            candidate_experience /
            required_experience
        ) * 100

        if experience_match > 100:
            experience_match = 100


    # Resume Skills


    found_skills = []

    for skill in SKILLS:

        if skill.lower() in text.lower():
            found_skills.append(skill)


    # Job Skills


    job_skills = []

    for skill in SKILLS:

        if skill.lower() in job_description.lower():
            job_skills.append(skill)

    # Matched Skills
    

    matched_skills = []

    for skill in found_skills:

        if skill in job_skills:
            matched_skills.append(skill)

    # Missing Skills
    

    missing_skills = []

    for skill in job_skills:

        if skill not in found_skills:
            missing_skills.append(skill)

    # Skill Match %

    if len(job_skills) > 0:

        match_percentage = (
            len(matched_skills)
            / len(job_skills)
        ) * 100

    else:
        match_percentage = 0

    # Overall ATS Score

    overall_score = (
        match_percentage * 0.7
        +
        experience_match * 0.3)
   
    # ATS Verdict
    

    if overall_score >= 80:

        ats_verdict = "Excellent Match"

    elif overall_score >= 60:

        ats_verdict = "Good Match"

    elif overall_score >= 40:

        ats_verdict = "Average Match"

    else:

        ats_verdict = "Low Match"


    
    print("Match Percentage:", match_percentage)
    print("Experience Match:", experience_match)
    print("Overall Score:", overall_score)

    return {
        "match_percentage": round(match_percentage, 2),
        "overall_score": round(overall_score, 2),
        "ats_verdict": ats_verdict,

        "resume_skills": found_skills,
        "job_skills": job_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,

        "required_experience": round(required_experience, 1),

        "candidate_experience": round(candidate_experience, 1),

        "experience_match": round(experience_match, 2)
    }


if __name__ == "__main__":
    app.run(debug=True)