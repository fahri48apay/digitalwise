import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Quizzes from './pages/Quizzes';
import Users from './pages/Users';
import Materials from './pages/Materials';
import Forum from './pages/Forum';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Appearance from './pages/Appearance';
import Notifications from './pages/Notifications';
import Login from './pages/Login';

const queryClient = new QueryClient();

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  // Check authentication status
  React.useEffect(() => {
    // TODO: Implement Firebase auth state listener
    const checkAuth = async () => {
      // For demo purposes, set to true
      setIsAuthenticated(true);
    };
    checkAuth();
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/users" element={<Users />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings/appearance" element={<Appearance />} />
            <Route path="/settings/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
