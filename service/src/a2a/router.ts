import { Router, Request, Response } from 'express';
import { AgentExecutor } from '@a2a-js/sdk/server';
import { handleA2ARequest } from './handle-a2a-request.js';
import { AgentCardBuilder } from './types.js';


export function A2AServiceRouter( executor: AgentExecutor, cardBuilder: AgentCardBuilder ) {
    const router = Router();

    router.get('/agent-card.json', async (req: Request, res: Response) => {
        const url = req.protocol + '://' + req.get('host') + req.originalUrl.replace(/\/agent-card\.json$/, '');
        const agentCard = cardBuilder({url});

        res.json(agentCard);
    });

    router.post('/', async (req: Request, res: Response) => {
        await handleA2ARequest(req, res, executor, true );
    });

    return router;
}