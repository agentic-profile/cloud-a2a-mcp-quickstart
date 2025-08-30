import { Routes, Route } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import Layout from './components/Layout';
import { ChatPage } from './pages/ChatPage';
import HomePage from './pages/HomePage';
import AgentsPage from './pages/AgentsPage';
import VenturePage from './pages/agents/VenturePage';
import MCPPage from './pages/MCPPage';
import SettingsPage from './pages/SettingsPage';

function App() {
    return (
        <HeroUIProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/agents" element={<AgentsPage />} />
                    <Route path="/agents/venture" element={<VenturePage />} />
                    <Route path="/mcp" element={<MCPPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </Layout>
        </HeroUIProvider>
    );
}

export default App;
