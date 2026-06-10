import { useEffect, useState } from "react";
import api from "../../utils/api";

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [enrollId, setEnrollId] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const [c, s] = await Promise.all([api.get("/courses"), api.get("/users?role=student")]);
      setCourses(c.data.courses);
      setAllStudents(s.data.users);
      setLoading(false);
    };
    fetch();
  }, []);

  const openCourse = (c) => { setSelected(c); setStudents(c.students || []); setEnrollId(""); };

  const handleEnroll = async () => {
    if (!enrollId) return;
    try {
      await api.post(`/courses/${selected._id}/enroll`, { studentId: enrollId });
      const res = await api.get(`/courses/${selected._id}`);
      setStudents(res.data.course.students);
      setSelected(res.data.course);
      setEnrollId("");
    } catch (err) {
      alert(err.response?.data?.message || "Error enrolling student.");
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;

  return (
    <div>
      <div className="page-header">
        <h1>📖 My Courses</h1>
        <p>View your assigned courses and manage enrolled students.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 20 }}>
        <div className="card">
          <div className="card-header"><h3>Courses ({courses.length})</h3></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Course</th><th>Code</th><th>Students</th><th></th></tr></thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c._id} style={{ cursor: "pointer" }} onClick={() => openCourse(c)}>
                    <td><strong>{c.name}</strong></td>
                    <td><code style={{background:"#f3f4f6",padding:"2px 6px",borderRadius:4}}>{c.code}</code></td>
                    <td>{c.students?.length || 0}</td>
                    <td><button className="btn btn-outline btn-sm">View →</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="card">
            <div className="card-header">
              <h3>📋 {selected.name} — Students</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setSelected(null)}>✕ Close</button>
            </div>
            <div className="card-body">
              <div className="form-group" style={{ display: "flex", gap: 8 }}>
                <select className="form-control" value={enrollId} onChange={e => setEnrollId(e.target.value)}>
                  <option value="">-- Enroll a student --</option>
                  {allStudents
                    .filter(s => !students.find(en => en._id === s._id))
                    .map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>)}
                </select>
                <button className="btn btn-success" onClick={handleEnroll}>Enroll</button>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Roll No</th><th>Semester</th></tr></thead>
                <tbody>
                  {students.length === 0
                    ? <tr><td colSpan={3} style={{textAlign:"center",color:"#9ca3af"}}>No students enrolled yet.</td></tr>
                    : students.map(s => (
                      <tr key={s._id}>
                        <td>{s.name}</td>
                        <td>{s.rollNumber || "—"}</td>
                        <td>{s.semester || "—"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourses;
