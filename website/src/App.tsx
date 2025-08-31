import { Routes, Route } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import Layout from './components/Layout';
import { ChatPage } from './pages/ChatPage';
import HomePage from './pages/HomePage';
import AgentsPage from './pages/AgentsPage';
import VenturePage from './pages/agents/VenturePage';
import A2ADebugPage from './pages/agents/A2ADebugPage';
import MCPPage from './pages/MCPPage';
import McpDebugPage from './pages/mcp/McpDebugPage';
import McpLocationPage from './pages/mcp/McpLocationPage';
import McpMatchPage from './pages/mcp/McpMatchPage';
import SettingsPage from './pages/SettingsPage';
import IdentityPage from './pages/IdentityPage';

function App() {
    return (
        <HeroUIProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/agents" element={<AgentsPage />} />
                    <Route path="/agents/venture" element={<VenturePage />} />
                    <Route path="/a2a/debug" element={<A2ADebugPage />} />
                    <Route path="/mcp" element={<MCPPage />} />
                    <Route path="/mcp/debug" element={<McpDebugPage />} />
                    <Route path="/mcp/location" element={<McpLocationPage />} />
                    <Route path="/mcp/match" element={<McpMatchPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/identity" element={<IdentityPage />} />
                </Routes>
            </Layout>
        </HeroUIProvider>
    );
}

export default App;
