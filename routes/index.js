const express = require('express');
const router = express.Router();

const DesignStorage = require('../services/DesignStorage');
const InvitationController = require('../controllers/InvitationController');

const storageService = new DesignStorage();
const invitationController = new InvitationController(storageService);

// --- Routes ---

router.get('/', invitationController.renderBuilder);

router.post('/save-design', invitationController.saveDesign);

// 🔴 CRITICAL FIX: Add '/:id' here so the server accepts the code
router.get('/share/:id', invitationController.renderInvitation);

module.exports = router;