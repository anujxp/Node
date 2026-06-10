import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (hasRole("admin")) {
          const [users, courses, grades] = await Promise.all([
            api.get("/users"),
            api.get("/courses"),
            api.get("/grades"),
          ]);
          setStats({
            totalUsers:    users.data.count,
            totalStudents: users.data.users.filter(u => u.role === "student").length,
            totalTeachers: users.data.users.filter(u => u.role === "teacher").length,
            totalCourses:  courses.data.count,
            totalGrades:   grades.data.count,
          });
        } else if (hasRole("teacher")) {
          const [courses, grades] = await Promise.all([
            api.get("/courses"),
            api.get("/grades"),
          ]);
          const totalStudents = courses.data.courses.reduce(
            (acc, c) => acc + c.students.length, 0
          );
          setStats({ totalCourses: courses.data.count, totalStudents, totalGrades: grades.data.count });
        } else {
          const [courses, grades] = await Promise.all([
            api.get("/courses"),
            api.get("/grades"),
          ]);
          const avg = grades.data.count > 0
            ? Math.round(grades.data.grades.reduce((a, g) => a + g.marks, 0) / grades.data.count)
            : 0;
          setStats({ totalCourses: courses.data.count, totalGrades: grades.data.count, avgMarks: avg });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const adminStats = [
    { label: "Total Users",    value: stats?.totalUsers,    icon: "👥", bg: "#eef2ff", color: "#4f46e5" },
    { label: "Students",       value: stats?.totalStudents, icon: "🎓", bg: "#d1fae5", color: "#059669" },
    { label: "Teachers",       value: stats?.totalTeachers, icon: "👨‍🏫", bg: "#cffafe", color: "#0891b2" },
    { label: "Courses",        value: stats?.totalCourses,  icon: "📚", bg: "#fef3c7", color: "#d97706" },
  ];

  const teacherStats = [
    { label: "My Courses",     value: stats?.totalCourses,  icon: "📖", bg: "#eef2ff", color: "#4f46e5" },
    { label: "My Students",    value: stats?.totalStudents, icon: "🎓", bg: "#d1fae5", color: "#059669" },
    { label: "Grades Given",   value: stats?.totalGrades,   icon: "✏️",  bg: "#fef3c7", color: "#d97706" },
  ];

  const studentStats = [
    { label: "Enrolled Courses", value: stats?.totalCourses, icon: "📖", bg: "#eef2ff", color: "#4f46e5" },
    { label: "Total Exams",      value: stats?.totalGrades,  icon: "📝", bg: "#d1fae5", color: "#059669" },
    { label: "Average Marks",    value: stats?.avgMarks ? `${stats.avgMarks}%` : "—", icon: "⭐", bg: "#fef3c7", color: "#d97706" },
  ];

  const statCards = hasRole("admin") ? adminStats : hasRole("teacher") ? teacherStats : studentStats;

  return (
    <div>
      <div className="page-header">
        <h1>👋 Welcome, {user?.name}!</h1>
        <p>
          {hasRole("admin")   && "You have full access to manage the system."}
          {hasRole("teacher") && `Teaching ${user?.subject || "your subject"} — here's your overview.`}
          {hasRole("student") && `Roll No: ${user?.rollNumber || "—"} · Semester ${user?.semester || "—"}`}
        </p>
      </div>

      <div className="stats-grid">
        {statCards.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div>
              <div className="stat-value">{stats ? s.value ?? "—" : "..."}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><h3>🔐 Your Role & Permissions</h3></div>
        <div className="card-body">
          <table>
            <thead>
              <tr>
                <th>Permission</th>
                <th>Admin</th>
                <th>Teacher</th>
                <th>Student</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Manage Users (CRUD)",       "✅", "❌", "❌"],
                ["Manage Courses (CRUD)",      "✅", "❌", "❌"],
                ["View All Courses",           "✅", "Own only", "Enrolled only"],
                ["Assign Grades",              "❌", "✅", "❌"],
                ["View Grades",                "✅", "Own courses", "Own grades"],
                ["Enroll Students",            "✅", "✅", "❌"],
                ["Delete Grades",              "✅", "❌", "❌"],
              ].map(([perm, ...vals]) => (
                <tr key={perm}>
                  <td><strong>{perm}</strong></td>
                  {vals.map((v, i) => (
                    <td key={i} style={{ color: v === "✅" ? "#059669" : v === "❌" ? "#dc2626" : "#d97706" }}>
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
