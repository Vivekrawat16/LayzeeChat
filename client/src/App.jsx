import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ChatRoom from './pages/ChatRoom';
import NearbyMatch from './pages/NearbyMatch';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatRoom />} />
        <Route path="/nearby" element={<NearbyMatch />} />
      </Routes>
    </Router>
  );
}

export default App;
