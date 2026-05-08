import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { PuzzlePage } from './pages/PuzzlePage';
import { Final } from './pages/Final';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/puzzle/:slug" element={<PuzzlePage />} />
      <Route path="/final" element={<Final />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
