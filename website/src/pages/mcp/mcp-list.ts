import type { MCPService } from './types';
import { MapPinIcon, GlobeAltIcon, WalletIcon, StarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

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
    },
    {
        id: '3',
        name: 'Wallet',
        description: 'Manage verifiable credentials and digital wallet items',
        icon: WalletIcon,
        route: '/mcp/wallet'
    },
    {
        id: '4',
        name: 'Reputation',
        description: 'Manage reputation items and reviews about others',
        icon: StarIcon,
        route: '/mcp/reputation'
    },
    /*{
        id: '2',
        name: 'VC Match',
        description: 'Connecting startups with capital',
        icon: CurrencyDollarIcon,
        route: '/mcp/vc-match'
    },*/
    {
        id: '5',
        name: 'Community',
        description: 'Bringing communities together, health, and wellness',
        icon: UserGroupIcon,
        route: '/mcp/community'
    }
];