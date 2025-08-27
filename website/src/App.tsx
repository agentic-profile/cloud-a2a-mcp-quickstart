import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ChatPage } from './pages/ChatPage';
import HomePage from './pages/HomePage';
import AgentsPage from './pages/AgentsPage';
import MCPPage from './pages/MCPPage';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/mcp" element={<MCPPage />} />
            </Routes>
        </Layout>
    );
}

export default App;
