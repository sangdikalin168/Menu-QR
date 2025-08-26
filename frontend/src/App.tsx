import { ApolloProvider } from '@apollo/client';
import { client } from './config/apollo';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './router/ProtectedRoute';
import { NotFoundPage } from './pages/NotFoundPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import { AuthInitializer } from './components/AuthInitializer';
import { UserRolePermission } from './features/user';
import DepartmentPage from './features/organization/department/pages/DepartmentPage';
import PositionPage from './features/organization/position/pages/PositionPage';
import EmployeePage from './features/organization/employee/pages/EmployeePage';
import AttendanceReport from './pages/AttendanceReport';
import LeavePage from './pages/Leave';
import ShiftPage from './features/organization/shift/pages/ShiftPage';
import TimetablesPage from './features/organization/timetable/pages/TimetablesPage';

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AuthInitializer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<UserRolePermission />} />
              <Route path="/departments" element={<DepartmentPage />} />
              <Route path="/positions" element={<PositionPage />} />
              <Route path="/employees" element={<EmployeePage />} />
              <Route path="/attendance-report" element={<AttendanceReport />} />
              <Route path="/leave" element={<LeavePage />} />
              <Route path="/shifts" element={<ShiftPage />} />
              <Route path="/timetables" element={<TimetablesPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;