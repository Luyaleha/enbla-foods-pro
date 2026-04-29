// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import CustomerMenu from './pages/CustomerMenu';
import AdminDashboard from './pages/AdminDashboard';
import AdminGuard from './components/AdminGuard'; // Import the guard

function App() {
  return (
    <Routes>
      <Route path="/" element={<CustomerMenu />} />
      
      {/* WRAP THE ADMIN ROUTE HERE */}
      <Route 
        path="/admin" 
        element={
          <AdminGuard>
            <AdminDashboard />
          </AdminGuard>
        } 
      />
    </Routes>
  );
}

export default App;