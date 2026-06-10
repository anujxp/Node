import { useEffect, useState } from "react";
import api from "../../utils/api";

const ROLES = ["student", "teacher", "admin"];

const defaultForm = { name: "", email: "", password: "", role: "student", subject: "", rollNumber: "", semester: "" };

const AdminUsers = () => {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]     = useState(defaultForm);
  const [error, setError]   = useState("");
  const [filter, setFilter] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    const res = await api.get("/users");
    setUsers(res.data.users);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => { setEditing(null); setForm(defaultForm); setError(""); setModal(true); };
  const openEdit   = (u) => { setEditing(u); setForm({ ...u, password: "" }); setError(""); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = async () => {
    setError("");
    try {
      if (editing) {
        const { password, ...data } = form;
        await api.put(`/users/${editing._id}`, data);
      } else {
        await api.post("/users", form);
      }
      await fetchUsers();
      closeModal();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  const filtered = filter ? users.filter(u => u.role === filter) : users;

  return (
    <div>
      <div className="page-header">
        <h1>👥 User Management</h1>
        <p>Create, edit, and manage all users across roles.</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: "flex", gap: 8 }}>
            {["", "admin", "teacher", "student"].map(r => (
              <button
                key={r}
                className={`btn btn-sm ${filter === r ? "btn-primary" : "btn-outline"}`}
                onClick={() => setFilter(r)}
              >
                {r || "All"} ({r ? users.filter(u => u.role === r).length : users.length})
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Add User</button>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Email</th><th>Role</th>
                  <th>Details</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                    <td style={{ fontSize: 12, color: "#6b7280" }}>
                      {u.role === "teacher" && u.subject}
                      {u.role === "student" && `Roll: ${u.rollNumber || "—"} · Sem ${u.semester || "—"}`}
                    </td>
                    <td><span style={{ color: u.isActive ? "#059669" : "#dc2626", fontSize: 12 }}>
                      {u.isActive ? "● Active" : "● Inactive"}
                    </span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(u)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>Delete</button>
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
              <h3>{editing ? "Edit User" : "Create User"}</h3>
              <button className="btn-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input className="form-control" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="form-control" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <select className="form-control" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                {!editing && (
                  <div className="form-group">
                    <label>Password</label>
                    <input className="form-control" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                  </div>
                )}
              </div>
              {form.role === "teacher" && (
                <div className="form-group">
                  <label>Subject</label>
                  <input className="form-control" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
                </div>
              )}
              {form.role === "student" && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Roll Number</label>
                    <input className="form-control" value={form.rollNumber} onChange={e => setForm({...form, rollNumber: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Semester</label>
                    <input className="form-control" type="number" min={1} max={8} value={form.semester} onChange={e => setForm({...form, semester: e.target.value})} />
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editing ? "Save Changes" : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
