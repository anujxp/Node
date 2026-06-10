import { useEffect, useState } from "react";
import api from "../../utils/api";

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/courses").then(res => {
      setCourses(res.data.courses);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>📖 My Courses</h1>
        <p>Courses you are currently enrolled in.</p>
      </div>

      {courses.length === 0 ? (
        <div className="card"><div className="card-body">
          <div className="empty-state">
            <div className="icon">📚</div>
            <h3>No courses yet</h3>
            <p>Ask your teacher or admin to enroll you in a course.</p>
          </div>
        </div></div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {courses.map(c => (
            <div className="card" key={c._id}>
              <div className="card-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700 }}>{c.name}</h3>
                    <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>{c.code}</code>
                  </div>
                  <span className="badge badge-student">{c.credits} cr</span>
                </div>
                <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>{c.description}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151" }}>
                  <span>👨‍🏫</span>
                  <strong>{c.teacher?.name}</strong>
                  <span style={{ color: "#9ca3af" }}>·</span>
                  <span>{c.teacher?.subject}</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: "#9ca3af" }}>
                  {c.students?.length} students enrolled
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;
