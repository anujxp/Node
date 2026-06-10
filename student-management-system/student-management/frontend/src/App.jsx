import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import AppLayout from "./components/shared/AppLayout";

import LoginPage      from "./pages/LoginPage";
import Dashboard      from "./pages/Dashboard";
import AdminUsers     from "./pages/admin/AdminUsers";
import AdminCourses   from "./pages/admin/AdminCourses";
import TeacherCourses from "./pages/teacher/TeacherCourses";
import TeacherGrades  from "./pages/teacher/TeacherGrades";
import StudentCourses from "./pages/student/StudentCourses";
import StudentGrades  from "./pages/student/StudentGrades";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* All logged-in users */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        } />

        {/* Admin only */}
        <Route path="/admin/users" element={
          <ProtectedRoute roles={["admin"]}>
            <AppLayout><AdminUsers /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin/courses" element={
          <ProtectedRoute roles={["admin"]}>
            <AppLayout><AdminCourses /></AppLayout>
          </ProtectedRoute>
        } />

        {/* Teacher only */}
        <Route path="/teacher/courses" element={
          <ProtectedRoute roles={["teacher"]}>
            <AppLayout><TeacherCourses /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/teacher/grades" element={
          <ProtectedRoute roles={["teacher"]}>
            <AppLayout><TeacherGrades /></AppLayout>
          </ProtectedRoute>
        } />

        {/* Student only */}
        <Route path="/student/courses" element={
          <ProtectedRoute roles={["student"]}>
            <AppLayout><StudentCourses /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/student/grades" element={
          <ProtectedRoute roles={["student"]}>
            <AppLayout><StudentGrades /></AppLayout>
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
