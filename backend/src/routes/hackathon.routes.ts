// hackathon.routes.ts
import { Router } from 'express';
import * as hackathonController from '../controllers/hackathon.controller';
import * as participantController from '../controllers/participant.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';
const hackathonRouter = Router();

// Hackathon management routes
hackathonRouter.get('/', hackathonController.getAllHackathons);
hackathonRouter.post('/', requireAuth, requireAdmin, hackathonController.createHackathon);
hackathonRouter.put('/:hackathonId', requireAuth, requireAdmin, hackathonController.editHackathonDetails);
hackathonRouter.get('/:hackathonId', hackathonController.viewHackathonDetails);
hackathonRouter.delete('/:hackathonId', requireAuth, requireAdmin, hackathonController.deleteHackathon);

// Participant management routes
hackathonRouter.post('/:hackathonId/join', requireAuth, participantController.joinHackathon);
hackathonRouter.put('/:hackathonId/participant', requireAuth, participantController.updateParticipantStatus);
hackathonRouter.get('/:hackathonId/participants', requireAuth, participantController.listParticipants);
hackathonRouter.delete('/:hackathonId/leave', requireAuth, participantController.leaveHackathon);

export default hackathonRouter;