import { useEffect, useState } from "react";
import api from "../../utils/api";

const StudentGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/grades").then(res => {
      setGrades(res.data.grades);
      setLoading(false);
    });
  }, []);

  const avg = grades.length > 0
    ? Math.round(grades.reduce((a, g) => a + g.marks, 0) / grades.length)
    : 0;

  const getColor = (marks) => {
    if (marks >= 80) return "#059669";
    if (marks >= 60) return "#d97706";
    return "#dc2626";
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>🎓 My Grades</h1>
        <p>View your exam results and academic performance.</p>
      </div>

      {grades.length > 0 && (
        <div className="stats-grid" style={{ marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#eef2ff" }}>📊</div>
            <div><div className="stat-value">{avg}%</div><div className="stat-label">Average Marks</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#d1fae5" }}>📝</div>
            <div><div className="stat-value">{grades.length}</div><div className="stat-label">Total Exams</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fef3c7" }}>⭐</div>
            <div>
              <div className="stat-value">{grades.filter(g => g.grade === "A+" || g.grade === "A").length}</div>
              <div className="stat-label">A / A+ Grades</div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header"><h3>Grade Report</h3></div>
        <div className="table-wrap">
          {grades.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🎓</div>
              <h3>No grades yet</h3>
              <p>Your grades will appear here once your teacher assigns them.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr><th>Course</th><th>Exam Type</th><th>Marks</th><th>Grade</th><th>Remarks</th><th>Date</th></tr>
              </thead>
              <tbody>
                {grades.map(g => (
                  <tr key={g._id}>
                    <td>
                      <strong>{g.course?.name}</strong><br />
                      <span style={{ fontSize: 11, color: "#9ca3af" }}>{g.course?.code}</span>
                    </td>
                    <td><span className="badge badge-student" style={{ textTransform: "capitalize" }}>{g.examType}</span></td>
                    <td>
                      <strong style={{ color: getColor(g.marks), fontSize: 16 }}>{g.marks}</strong>
                      <span style={{ color: "#9ca3af", fontSize: 12 }}>/100</span>
                    </td>
                    <td><span className={`badge badge-${g.grade}`}>{g.grade}</span></td>
                    <td style={{ color: "#6b7280", fontSize: 13 }}>{g.remarks || "—"}</td>
                    <td style={{ fontSize: 12, color: "#9ca3af" }}>
                      {new Date(g.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentGrades;
