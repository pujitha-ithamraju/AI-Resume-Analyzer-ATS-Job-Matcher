
/* ====================================================

AI Resume Analyzer & Job Matcher
Frontend: React
Backend: Flask
Features:
 1. Resume Upload
 2. Skill Matching
 3. Experience Analysis
 4. ATS Score Calculation
 5. Missing Skills Detection  
 
 ==================================================== */

import { useState } from "react";

function App() {

  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  
  
  async function analyzeResume() {

    if (!resume) {
      alert("Please upload a resume.");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    formData.append("resume", resume);
    formData.append("job_description", jobDescription);

    const response = await fetch(
      "http://127.0.0.1:5000/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    //console.log("FULL DATA:",data);
    //console.log("OVERALLL DATA:",data.overall_score);


    setResult(data);
  }

  return (


    /*--------------- Main page  Section ------------------*/

    <div
      style={{
        maxWidth: "1000px",
        margin: "auto",
        padding: "30px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
      }}
    >

      {/*------------- Project Title ---------------------*/}

      <h1
        style={{
          color:  "#1e293b",
          marginBottom: "40px",
        }}
      >
        AI Resume Analyzer & Job Matcher
      </h1>

      {/*------------------- Resume Upload Section -----------------*/}

      <label>
        <b>Upload Resume</b>
      </label>

      <br />
      <br />

      <input
        type="file"
        onChange={(event) =>
          setResume(event.target.files[0])
        }
      />

      <br />
      <br />
      <br />

      {/*-------------------- Job Description Input Section ---------------*/}

      <label>
        <b>Paste Job Description</b>
      </label>

      <br />
      <br />

      <textarea
        rows="12"
        cols="100"
        value={jobDescription}
        onChange={(event) =>
          setJobDescription(event.target.value)
        }
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          fontSize: "14px",
          resize: "vertical",
        }}
      />

      <br />
      <br />

      {/*----------------- Analyze Resume Button ----------------------*/}

      <button
        onClick={analyzeResume}
        style={{
          backgroundColor: loading ? "#94a3b8" : "#2563eb",
          color: "white",
          border: "none",
          padding: "12px 30px",
          borderRadius: "8px",
          cursor: loading ? "not allowed" : "pointer" ,
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        {loading ? "Analyzing Resume..." : "Analyse Resume"}
      </button>


      {/*------------------- Results Container ---------------------*/}

      {result && (
        <div
          style={{
            backgroundColor: "white",
            marginTop: "40px",
            padding: "30px",
            borderRadius: "12px",
            boxShadow:
              "0px 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h2>
            AI Resume Analyzer Results
          </h2>

        {/*------------- Resume Match Percentage  -----------------*/}
          <h3>
            Resume Match Percentage:
            {" "}
            {result.match_percentage}%
          </h3>

        {/*---------------- Match Percentage Progress bar ------------------*/}

          <div
             style={{
                width: "400px",
                height: "30px",
                backgroundColor: "#ddd",
                borderRadius: "15px",
                overflow: "hidden",
                margin: "auto",
              }}
>
              <div
                style={{
                  width: `${result.match_percentage}%`,
                  height: "100%",
                  backgroundColor:
                  result.match_percentage >= 80
                  ? "green"
                  : result.match_percentage >= 60
                  ? "orange"
                  : "red",
                  color: "white",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  }}
              >
              {result.match_percentage}%
              </div>
          </div>

        {/*------------------ Overall ATS Score Section --------------------*/}

          <h3>
              Overall ATS Score:
              {" "}
              {result.overall_score}%
          </h3>

        {/*---------------- Overal ATS Score Progress Bar -----------*/}

          <div
            style={{
            width: "400px",
            height: "30px",
            backgroundColor: "#ddd",
            borderRadius: "15px",
            overflow: "hidden",
            margin: "10px auto"
            }}
          >
            <div
              style={{
              width: `${result.overall_score}%`,
              height: "100%",
              backgroundColor:
                result.overall_score >= 80
                  ? "green"
                  : result.overall_score >= 60
                  ? "orange"
                  : "red",
                color: "white",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
                }}
            >
              {result.overall_score}%
            </div>
          </div>

          {/*------------------ ATS Verdict ----------------*/}

          <h3
            style={{
              color:
                result.ats_verdict ===
                "Excellent Match"
                  ? "green"
                  : result.ats_verdict ===
                    "Good Match"
                  ? "green"
                  : result.ats_verdict ===
                    "Average Match"
                  ? "orange"
                  : "red",
            }}
          >
            ATS Verdict:
            {" "}
            {result.ats_verdict}
          </h3>

          <hr />

          {/*-------------- Resume Skills  ---------------*/}

          <h3>Resume Skills</h3>

          <p>
            {result.resume_skills.join(", ")}
          </p>

        {/*-------------------- Job Skills  ----------------*/}

          <h3>Job Skills</h3>

          <p>
            {result.job_skills.join(", ")}
          </p>

        {/*----------------- Matched Skills  -------------------*/}

          <h3>Matched Skills</h3>

          <p
            style={{
              color: "green",
              fontWeight: "bold",
            }}
          >
            {result.matched_skills.join(", ")}
          </p>

        {/*--------------- Experience AnalysiS  -----------------*/}

          <h3>
            Required Experience:
            {" "}
            {result.required_experience} 
            Years
          </h3>

          <h3>
            Candidate Experience:
            {" "}
            {result.candidate_experience} 
            Years
          </h3>

          <h3>
            Experience Match:
            {" "}
            {result.experience_match}%
          </h3>

          <div
            style={{
              width: "400px",
              height: "20px",
              backgroundColor: "#ddd",
              borderRadius: "10px",
              margin: "10px auto"
            }}
          >
          <div
              style={{
                width: `${result.experience_match}%`,
                height: "100%",
                backgroundColor: "#28a745",
                borderRadius: "10px",
                color: "white",
                textAlign: "center"
              }}
          >
              {result.experience_match}%
          </div>
        </div>
        
        
        {/*-------------- Missing Skills -------------------*/}

          <h3>
          
            Missing Skills
          
          </h3>

          <p
            style={{
              color: "red",
              fontWeight: "bold",
            }}
          >
            {result.missing_skills.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;