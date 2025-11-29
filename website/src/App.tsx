import { Routes, Route } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import { useEffect } from 'react';
import Layout from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ChatPage } from './pages/agents/ChatPage';
import HomePage from './pages/HomePage';
import AgentsIndexPage from './pages/agents/AgentsIndexPage';
import VenturePage from './pages/agents/venture/VenturePage';
import CapitalPage from './pages/agents/CapitalPage';
import VolunteerPage from './pages/agents/VolunteerPage';
import CharityPage from './pages/agents/CharityPage';
import A2ADebugPage from './pages/agents/A2ADebugPage';
import MCPIndexPage from './pages/mcp/MCPIndexPage';
import McpCommunityPage from './pages/mcp/community/McpCommunityPage';
import McpDebugPage from './pages/mcp/McpDebugPage';
import McpLocationPage from './pages/mcp/location/McpLocationPage';
import McpVcMatchPage from './pages/mcp/McpVcMatchPage';
import McpVolunteerMatchPage from './pages/mcp/McpVolunteerMatchPage';
import McpVenturePage from './pages/mcp/venture/McpVenturePage';
import McpReputationPage from './pages/mcp/reputation/McpReputationPage';
import McpWalletPage from './pages/mcp/wallet/McpWalletPage';
import McpActivityPage from './pages/mcp/activity/McpActivityPage';
import SettingsPage from './pages/SettingsPage';
import IdentityPage from './pages/identity/IdentityPage';
import McpVolunteerPage from './pages/mcp/volunteer/McpVolunteerPage';
import { useSettingsStore } from './stores/settingsStore';

function App() {
    const { serverUrl, setServerUrl } = useSettingsStore();

    useEffect(() => {
        // Only set serverUrl if it's not already set or if it's the default localhost value
        if (serverUrl === undefined) {
            const hostname = window.location.hostname.toLowerCase();
            
            if (hostname === 'localhost') {
                setServerUrl('http://localhost:3000');
            } else if (hostname === 'example.agenticprofile.ai') {
                setServerUrl('https://example-api.agenticprofile.ai');
            }
        }
    }, [serverUrl, setServerUrl]);

    return (
        <ErrorBoundary>
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
                        <Route path="/mcp/wallet" element={<McpWalletPage />} />
                        <Route path="/mcp/community" element={<McpCommunityPage />} />
                        <Route path="/mcp/activity" element={<McpActivityPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/identity" element={<IdentityPage />} />
                        <Route path="/mcp/volunteer" element={<McpVolunteerPage />} />
                    </Routes>
                </Layout>
            </HeroUIProvider>
        </ErrorBoundary>
    );
}

export default App;
