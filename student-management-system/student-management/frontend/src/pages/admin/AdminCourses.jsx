import { useEffect, useState } from "react";
import api from "../../utils/api";

const defaultForm = { name: "", code: "", description: "", credits: 3, teacher: "" };

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(defaultForm);
  const [error, setError]       = useState("");

  const fetchAll = async () => {
    setLoading(true);
    const [c, u] = await Promise.all([api.get("/courses"), api.get("/users?role=teacher")]);
    setCourses(c.data.courses);
    setTeachers(u.data.users);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditing(null); setForm(defaultForm); setError(""); setModal(true); };
  const openEdit   = (c) => { setEditing(c); setForm({ ...c, teacher: c.teacher?._id || "" }); setError(""); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = async () => {
    setError("");
    try {
      if (editing) await api.put(`/courses/${editing._id}`, form);
      else         await api.post("/courses", form);
      await fetchAll();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving course.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return;
    await api.delete(`/courses/${id}`);
    fetchAll();
  };

  return (
    <div>
      <div className="page-header">
        <h1>📚 Course Management</h1>
        <p>Manage all courses, assign teachers, and enroll students.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>All Courses ({courses.length})</h3>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>+ New Course</button>
        </div>
        <div className="table-wrap">
          {loading ? <div className="loading"><div className="spinner" /></div> : (
            <table>
              <thead>
                <tr><th>Course</th><th>Code</th><th>Teacher</th><th>Students</th><th>Credits</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {courses.map(c => (
                  <tr key={c._id}>
                    <td><strong>{c.name}</strong><br /><span style={{fontSize:12,color:"#6b7280"}}>{c.description?.slice(0,50)}</span></td>
                    <td><code style={{background:"#f3f4f6",padding:"2px 6px",borderRadius:4}}>{c.code}</code></td>
                    <td>{c.teacher?.name || "—"}</td>
                    <td><span className="badge badge-student">{c.students?.length || 0} students</span></td>
                    <td>{c.credits}</td>
                    <td>
                      <div style={{display:"flex",gap:6}}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editing ? "Edit Course" : "New Course"}</h3>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-row">
                <div className="form-group">
                  <label>Course Name</label>
                  <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Course Code</label>
                  <input className="form-control" value={form.code} onChange={e => setForm({...form, code: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <input className="form-control" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Assign Teacher</label>
                  <select className="form-control" value={form.teacher} onChange={e => setForm({...form, teacher: e.target.value})}>
                    <option value="">-- Select Teacher --</option>
                    {teachers.map(t => <option key={t._id} value={t._id}>{t.name} ({t.subject})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Credits</label>
                  <input className="form-control" type="number" min={1} max={6} value={form.credits} onChange={e => setForm({...form, credits: e.target.value})} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editing ? "Save" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
