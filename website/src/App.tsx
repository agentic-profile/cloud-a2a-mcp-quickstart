import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ChatPage } from './pages/ChatPage';
import HomePage from './pages/HomePage';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chat" element={<ChatPage />} />
            </Routes>
        </Layout>
    );
}

export default App;
