import { Routes, Route } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import Layout from './components/Layout';
import { ChatPage } from './pages/agents/ChatPage';
import HomePage from './pages/HomePage';
import AgentsIndexPage from './pages/agents/AgentsIndexPage';
import VenturePage from './pages/agents/VenturePage';
import CapitalPage from './pages/agents/CapitalPage';
import VolunteerPage from './pages/agents/VolunteerPage';
import CharityPage from './pages/agents/CharityPage';
import A2ADebugPage from './pages/agents/A2ADebugPage';
import MCPIndexPage from './pages/mcp/MCPIndexPage';
import McpDebugPage from './pages/mcp/McpDebugPage';
import McpLocationPage from './pages/mcp/McpLocationPage';
import McpVcMatchPage from './pages/mcp/McpVcMatchPage';
import McpVolunteerMatchPage from './pages/mcp/McpVolunteerMatchPage';
import McpVenturePage from './pages/mcp/McpVenturePage';
import McpReputationPage from './pages/mcp/McpReputationPage';
import SettingsPage from './pages/SettingsPage';
import IdentityPage from './pages/IdentityPage';

function App() {
    return (
        <HeroUIProvider>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/agents" element={<AgentsIndexPage />} />
                    <Route path="/agents/venture" element={<VenturePage />} />
                    <Route path="/agents/capital" element={<CapitalPage />} />
                    <Route path="/agents/volunteer" element={<VolunteerPage />} />
                    <Route path="/agents/charity" element={<CharityPage />} />
                    <Route path="/a2a/debug" element={<A2ADebugPage />} />
                    <Route path="/mcp" element={<MCPIndexPage />} />
                    <Route path="/mcp/debug" element={<McpDebugPage />} />
                    <Route path="/mcp/location" element={<McpLocationPage />} />
                    <Route path="/mcp/vc-match" element={<McpVcMatchPage />} />
                    <Route path="/mcp/volunteer-match" element={<McpVolunteerMatchPage />} />
                    <Route path="/mcp/reputation" element={<McpReputationPage />} />
                    <Route path="/mcp/venture" element={<McpVenturePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/identity" element={<IdentityPage />} />
                </Routes>
            </Layout>
        </HeroUIProvider>
    );
}

export default App;
