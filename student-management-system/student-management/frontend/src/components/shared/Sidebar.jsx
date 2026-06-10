import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Menu config — each item has allowed roles
const NAV_ITEMS = [
  { label: "Dashboard",  icon: "📊", path: "/dashboard",       roles: ["admin", "teacher", "student"] },
  // Admin
  { label: "All Users",  icon: "👥", path: "/admin/users",     roles: ["admin"], section: "Admin" },
  { label: "All Courses",icon: "📚", path: "/admin/courses",   roles: ["admin"] },
  // Teacher
  { label: "My Courses", icon: "📖", path: "/teacher/courses", roles: ["teacher"], section: "Teacher" },
  { label: "Grade Students", icon: "✏️", path: "/teacher/grades", roles: ["teacher"] },
  // Student
  { label: "My Courses", icon: "📖", path: "/student/courses", roles: ["student"], section: "Student" },
  { label: "My Grades",  icon: "🎓", path: "/student/grades",  roles: ["student"] },
];

const Sidebar = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(user?.role));
  let lastSection = null;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>🏫 EduManage</h2>
        <p>Student Management System</p>
      </div>

      <nav className="sidebar-nav">
        {visibleItems.map((item) => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;

          return (
            <div key={item.path}>
              {showSection && <div className="nav-section">{item.section}</div>}
              <button
                className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className={`avatar ${user?.role}`}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={logout}>🚪 Logout</button>
      </div>
    </aside>
  );
};

export default Sidebar;
