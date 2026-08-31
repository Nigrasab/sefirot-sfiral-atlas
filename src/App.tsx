import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AboutPage from './pages/AboutPage';
import EncyclopediaPage from './pages/EncyclopediaPage';
import GematriaPage from './pages/GematriaPage';
import HomePage from './pages/HomePage';
import JournalPage from './pages/JournalPage';
import LabPage from './pages/LabPage';
import NavigatorPage from './pages/NavigatorPage';
import SfiralPage from './pages/SfiralPage';
import TreePage from './pages/TreePage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/tree" element={<TreePage />} />
          <Route path="/sfiral" element={<SfiralPage />} />
          <Route path="/navigator" element={<NavigatorPage />} />
          <Route path="/gematria" element={<GematriaPage />} />
          <Route path="/encyclopedia" element={<EncyclopediaPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
