import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Accounts from './pages/Accounts';
import Categories from './pages/Categories';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { useEffect } from 'react';

function App() {
  const { currentUser, setCurrentUser } = useAppStore();

  useEffect(() => {
    // Initialize with demo user if no user exists
    if (!currentUser) {
      setCurrentUser({
        id: '1',
        name: 'Demo User',
        email: 'demo@financa.com',
        type: 'PF',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }, [currentUser, setCurrentUser]);

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 