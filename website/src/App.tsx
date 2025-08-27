import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import { ChatPage } from './pages/ChatPage';
import HomePage from './pages/HomePage';

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 text-gray-900 dark:text-white transition-colors duration-300">
            <Navigation />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chat" element={<ChatPage />} />
            </Routes>
        </div>
    );
}

export default App;
