import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import BriefingPage from './pages/BriefingPage';
import ThreatPulse from './pages/ThreatPulse';
import Favorites from './pages/Favorites';
import Archive from './pages/Archive';
import About from './pages/About';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="pulse" element={<ThreatPulse />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="briefing/:id" element={<BriefingPage />} />
            <Route path="archive" element={<Archive />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
