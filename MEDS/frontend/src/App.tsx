import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import PharmacieDashboard from './pages/PharmacieDashboard';
import LivreurDashboard from './pages/LivreurDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public — with Navbar + Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal" element={<Legal />} />
        </Route>

        {/* Auth — split-screen */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Dashboards — with Sidebar */}
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/patient/*" element={<PatientDashboard />} />
        <Route path="/pharmacie" element={<PharmacieDashboard />} />
        <Route path="/pharmacie/*" element={<PharmacieDashboard />} />
        <Route path="/livreur" element={<LivreurDashboard />} />
        <Route path="/livreur/*" element={<LivreurDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
