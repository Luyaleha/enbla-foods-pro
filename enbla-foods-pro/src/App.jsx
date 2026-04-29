import { Routes, Route } from 'react-router-dom';
import CustomerMenu from './pages/CustomerMenu';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      {/* When the URL is localhost:5173/ */}
      <Route path="/" element={<CustomerMenu />} />

      {/* When the URL is localhost:5173/admin */}
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;