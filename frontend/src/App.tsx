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