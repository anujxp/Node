import { useEffect, useState } from "react";
import api from "../../utils/api";

const EXAM_TYPES = ["midterm", "final", "assignment", "quiz"];

const TeacherGrades = () => {
  const [grades, setGrades]   = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState({ courseId: "", studentId: "", marks: "", examType: "final", remarks: "" });
  const [courseStudents, setCourseStudents] = useState([]);
  const [error, setError]     = useState("");

  const fetchAll = async () => {
    const [g, c] = await Promise.all([api.get("/grades"), api.get("/courses")]);
    setGrades(g.data.grades);
    setCourses(c.data.courses);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCourseChange = (courseId) => {
    setForm(f => ({ ...f, courseId, studentId: "" }));
    const course = courses.find(c => c._id === courseId);
    setCourseStudents(course?.students || []);
  };

  const handleSave = async () => {
    setError("");
    try {
      await api.post("/grades", form);
      await fetchAll();
      setModal(false);
      setForm({ courseId: "", studentId: "", marks: "", examType: "final", remarks: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Error saving grade.");
    }
  };

  const getGradeBadge = (grade) => <span className={`badge badge-${grade}`}>{grade}</span>;

  return (
    <div>
      <div className="page-header">
        <h1>✏️ Grade Students</h1>
        <p>Assign and manage grades for your students.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>All Grades ({grades.length})</h3>
          <button className="btn btn-primary btn-sm" onClick={() => { setModal(true); setError(""); }}>+ Add Grade</button>
        </div>
        <div className="table-wrap">
          {loading ? <div className="loading"><div className="spinner" /></div> : (
            <table>
              <thead><tr><th>Student</th><th>Course</th><th>Exam</th><th>Marks</th><th>Grade</th><th>Remarks</th></tr></thead>
              <tbody>
                {grades.length === 0
                  ? <tr><td colSpan={6}><div className="empty-state"><div className="icon">📊</div><h3>No grades yet</h3><p>Click "Add Grade" to assign marks.</p></div></td></tr>
                  : grades.map(g => (
                    <tr key={g._id}>
                      <td><strong>{g.student?.name}</strong><br /><span style={{fontSize:11,color:"#9ca3af"}}>{g.student?.rollNumber}</span></td>
                      <td>{g.course?.name}<br /><span style={{fontSize:11,color:"#9ca3af"}}>{g.course?.code}</span></td>
                      <td><span className="badge badge-student" style={{textTransform:"capitalize"}}>{g.examType}</span></td>
                      <td><strong>{g.marks}</strong>/100</td>
                      <td>{getGradeBadge(g.grade)}</td>
                      <td style={{color:"#6b7280",fontSize:13}}>{g.remarks || "—"}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Assign Grade</h3>
              <button className="btn-close" onClick={() => setModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-group">
                <label>Course</label>
                <select className="form-control" value={form.courseId} onChange={e => handleCourseChange(e.target.value)}>
                  <option value="">-- Select Course --</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Student</label>
                <select className="form-control" value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} disabled={!form.courseId}>
                  <option value="">-- Select Student --</option>
                  {courseStudents.map(s => <option key={s._id} value={s._id}>{s.name} ({s.rollNumber})</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Exam Type</label>
                  <select className="form-control" value={form.examType} onChange={e => setForm({...form, examType: e.target.value})}>
                    {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Marks (0–100)</label>
                  <input className="form-control" type="number" min={0} max={100} value={form.marks} onChange={e => setForm({...form, marks: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Remarks</label>
                <input className="form-control" placeholder="Optional feedback..." value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Grade</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherGrades;
