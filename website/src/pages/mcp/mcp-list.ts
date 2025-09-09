import type { MCPService } from './types';
import { MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export const mcpServices: MCPService[] = [
    {
        id: '1',
        name: 'Location',
        description: 'Find other people or businesses near you',
        icon: MapPinIcon,
        route: '/mcp/location'
    },
    {
        id: '2',
        name: 'Venture',
        description: 'Manage your venture profile and list of others',
        icon:GlobeAltIcon,
        route: '/mcp/venture'
    } /*,
    {
        id: '2',
        name: 'VC Match',
        description: 'Connecting startups with capital',
        icon: CurrencyDollarIcon,
        route: '/mcp/vc-match'
    },
    {
        id: '3',
        name: 'Volunteer Match',
        description: 'Connect with similar people',
        icon: UserGroupIcon,
        route: '/mcp/volunteer-match'
    },
    {
        id: '4',
        name: 'Reputation',
        description: 'Check on the reputation of people and businesses',
        icon: ShieldCheckIcon,
        route: '/mcp/reputation'
    }*/
];